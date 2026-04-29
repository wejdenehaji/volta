import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 10;

export function generateOTP(): string {
  // Cryptographically secure — never use Math.random()
  return crypto.randomInt(100000, 1000000).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

export async function verifyOTPHash(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function getExpiryTime(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}