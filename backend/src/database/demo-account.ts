import { Repository } from 'typeorm';
import { isEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../modules/users/entities/user.entity';

export const DEFAULT_DEMO_EMAIL = 'demo@studyconnect.test';

export function demoCredentials(environment: NodeJS.ProcessEnv) {
  const email = (environment.DEMO_ACCOUNT_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase();
  const password = environment.DEMO_ACCOUNT_PASSWORD;
  if (!isEmail(email)) throw new Error('DEMO_ACCOUNT_EMAIL must be a valid email address.');
  if (!password || password.length < 12 || password.length > 72) {
    throw new Error('Set DEMO_ACCOUNT_PASSWORD to a password of 12–72 characters in the backend environment settings.');
  }
  return { email, password };
}

export async function createDemoAccount(repository: Repository<User>, credentials: { email: string; password: string }) {
  const existing = await repository.findOne({ where: { email: credentials.email } });
  // Repeated deployment commands must not reset credentials, reactivate accounts,
  // or turn an existing student's account into a verified demo account.
  if (existing) return { created: false, email: existing.email };

  const user = repository.create({
    email: credentials.email,
    password: await bcrypt.hash(credentials.password, 10),
    firstName: 'Demo',
    lastName: 'Student',
    role: UserRole.LEARNER,
    department: 'Computer Science and Engineering',
    level: '200',
    bio: 'Demo profile for exploring the StudyConnect learning workspace.',
    coursesToTeach: [],
    coursesNeedingHelp: [],
    isVerified: true,
    isActive: true,
  });
  await repository.save(user);
  return { created: true, email: user.email };
}
