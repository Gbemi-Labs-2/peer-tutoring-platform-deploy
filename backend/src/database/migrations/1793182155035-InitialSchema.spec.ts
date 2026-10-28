import { QueryRunner } from 'typeorm';
import { InitialSchema1793182155035 } from './1793182155035-InitialSchema';

describe('InitialSchema migration', () => {
  const migration = new InitialSchema1793182155035();

  it('baselines a complete existing schema without changing it', async () => {
    const queryRunner = {
      hasTable: jest.fn().mockResolvedValue(true),
      query: jest.fn(),
    } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(queryRunner.query).not.toHaveBeenCalled();
  });

  it('refuses to modify a partial existing schema', async () => {
    const queryRunner = {
      hasTable: jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false),
      query: jest.fn(),
    } as unknown as QueryRunner;

    await expect(migration.up(queryRunner)).rejects.toThrow(
      'A partial StudyConnect schema already exists',
    );
    expect(queryRunner.query).not.toHaveBeenCalled();
  });

  it('creates the initial schema on an empty database', async () => {
    const queryRunner = {
      hasTable: jest.fn().mockResolvedValue(false),
      query: jest.fn().mockResolvedValue(undefined),
    } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(queryRunner.query).toHaveBeenCalledWith(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
    );
    expect(queryRunner.query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "users"'),
    );
  });
});
