import { jwtConfig } from './jwt.config';

describe('jwtConfig', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it('rejects missing or placeholder secrets in production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    expect(() => jwtConfig()).toThrow(
      'Production requires a randomly generated JWT_SECRET',
    );

    process.env.JWT_SECRET = 'replace-with-a-random-secret-before-production';
    expect(() => jwtConfig()).toThrow(
      'Production requires a randomly generated JWT_SECRET',
    );
  });

  it('allows the local development secret outside production', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.JWT_SECRET;

    expect(jwtConfig().secret).toBe('development-only-secret-change-me');
  });
});
