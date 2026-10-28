import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { createDemoAccount, DEFAULT_DEMO_EMAIL, demoCredentials } from './demo-account';

describe('Demo account setup', () => {
  const password = 'test-only-password-2026';

  it('requires a configured password instead of a public default', () => {
    expect(() => demoCredentials({})).toThrow('DEMO_ACCOUNT_PASSWORD');
    expect(() => demoCredentials({ DEMO_ACCOUNT_PASSWORD: 'short' })).toThrow('DEMO_ACCOUNT_PASSWORD');
    expect(() => demoCredentials({ DEMO_ACCOUNT_PASSWORD: 'x'.repeat(73) })).toThrow('DEMO_ACCOUNT_PASSWORD');
  });

  it('normalizes the email and validates configuration', () => {
    expect(demoCredentials({ DEMO_ACCOUNT_PASSWORD: password })).toEqual({ email: DEFAULT_DEMO_EMAIL, password });
    expect(demoCredentials({ DEMO_ACCOUNT_PASSWORD: password, DEMO_ACCOUNT_EMAIL: ' Demo@Example.test ' }).email).toBe('demo@example.test');
    expect(() => demoCredentials({ DEMO_ACCOUNT_PASSWORD: password, DEMO_ACCOUNT_EMAIL: 'invalid' })).toThrow('DEMO_ACCOUNT_EMAIL');
  });

  it('creates a verified learner with a hashed password and no fabricated activity', async () => {
    const create = jest.fn(value => value);
    const save = jest.fn(value => Promise.resolve(value));
    const repository = { findOne: jest.fn().mockResolvedValue(null), create, save } as unknown as Repository<User>;
    expect(await createDemoAccount(repository, { email: DEFAULT_DEMO_EMAIL, password })).toEqual({ created: true, email: DEFAULT_DEMO_EMAIL });
    const user = save.mock.calls[0][0];
    expect(user.role).toBe(UserRole.LEARNER);
    expect(user.isVerified).toBe(true);
    expect(user.isActive).toBe(true);
    expect(user.password).not.toBe(password);
    expect(await bcrypt.compare(password, user.password)).toBe(true);
    expect(user.coursesNeedingHelp).toEqual([]);
  });

  it('never changes or verifies an existing account, including inactive accounts', async () => {
    const existing = { email: DEFAULT_DEMO_EMAIL, isVerified: false, isActive: false };
    const repository = { findOne: jest.fn().mockResolvedValue(existing), create: jest.fn(), save: jest.fn() } as unknown as Repository<User>;
    expect(await createDemoAccount(repository, { email: DEFAULT_DEMO_EMAIL, password })).toEqual({ created: false, email: DEFAULT_DEMO_EMAIL });
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(existing.isVerified).toBe(false);
    expect(existing.isActive).toBe(false);
  });
});
