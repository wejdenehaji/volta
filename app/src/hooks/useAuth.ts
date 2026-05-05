import { useState, useEffect } from 'react';
import keycloak from '../keycloak';

// Lives outside React — survives StrictMode double-render
let initPromise: Promise<boolean> | null = null;

function getKeycloakInit(): Promise<boolean> {
  if (!initPromise) {
    initPromise = keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });
  }
  return initPromise;
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getKeycloakInit()
      .then((auth) => {
        setAuthenticated(auth);
        setToken(keycloak.token ?? null);
        setLoading(false);

        setInterval(() => {
          keycloak.updateToken(60).then((refreshed) => {
            if (refreshed) setToken(keycloak.token ?? null);
          });
        }, 30_000);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const login = () =>
    keycloak.login({ redirectUri: 'http://localhost:3000/app/map' });

  const logout = () =>
    keycloak.logout({ redirectUri: 'http://localhost:3000' });

  return { authenticated, loading, token, login, logout };
}