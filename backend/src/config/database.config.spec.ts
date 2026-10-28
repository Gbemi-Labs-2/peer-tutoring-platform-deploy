import { databaseConfig } from './database.config';

describe('databaseConfig', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('uses a managed PostgreSQL URL instead of split connection fields', () => {
    process.env.DATABASE_URL =
      'postgres://example.test/study_connect?sslmode=require';
    process.env.DB_HOST = 'ignored.example.test';

    const config = databaseConfig() as Record<string, unknown>;

    expect(config.url).toBe(
      'postgres://example.test/study_connect?sslmode=require',
    );
    expect(config).not.toHaveProperty('host');
  });

  it('preserves split local PostgreSQL configuration when no URL is set', () => {
    delete process.env.DATABASE_URL;
    process.env.DB_HOST = 'localhost';
    process.env.DB_DATABASE = 'study_connect_db';

    const config = databaseConfig() as Record<string, unknown>;

    expect(config.host).toBe('localhost');
    expect(config.database).toBe('study_connect_db');
    expect(config).not.toHaveProperty('url');
  });
});
