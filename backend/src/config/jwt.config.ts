import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (
    process.env.NODE_ENV === 'production' &&
    (!secret ||
      secret.length < 32 ||
      /replace-with|local-development/i.test(secret))
  ) {
    throw new Error(
      'Production requires a randomly generated JWT_SECRET of at least 32 characters.',
    );
  }

  return {
    secret: secret || 'development-only-secret-change-me',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  };
});
