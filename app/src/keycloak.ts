import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'ev-app',
  clientId: 'ev-frontend',
});

export default keycloak;