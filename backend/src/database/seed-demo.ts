import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { User } from '../modules/users/entities/user.entity';
import { createDemoAccount, demoCredentials } from './demo-account';

async function seed() {
  const credentials = demoCredentials(process.env);
  // Use the same connection as the application; never change its schema here.
  const database = new DataSource({ ...dataSourceOptions, synchronize: false, logging: false });
  try {
    await database.initialize();
    const result = await database.transaction(manager => createDemoAccount(manager.getRepository(User), credentials));
    console.log(result.created
      ? `Demo learner created: ${result.email}. Sign in with the password set in DEMO_ACCOUNT_PASSWORD.`
      : `Account ${result.email} already exists and was left unchanged. Its password was not reset.`);
  } finally {
    if (database.isInitialized) await database.destroy();
  }
}

seed().catch(error => {
  // Do not print driver error details, query parameters, or credentials.
  const message = error instanceof Error && /^DEMO_ACCOUNT_EMAIL|^Set DEMO_ACCOUNT_PASSWORD/.test(error.message)
    ? error.message
    : 'Demo account setup failed. Check database access and that the application schema exists. No existing account was overwritten.';
  console.error(message);
  process.exitCode = 1;
});
