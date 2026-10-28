import { validate } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

describe('LoginDto', () => {
  it('accepts a legacy gender field without requiring it for authentication', async () => {
    const dto = Object.assign(new LoginDto(), {
      email: 'student@example.test',
      password: 'synthetic-password',
      gender: 'Female',
    });

    await expect(
      validate(dto, { whitelist: true, forbidNonWhitelisted: true }),
    ).resolves.toHaveLength(0);
  });

  it('continues rejecting unrelated fields', async () => {
    const dto = Object.assign(new LoginDto(), {
      email: 'student@example.test',
      password: 'synthetic-password',
      admin: true,
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('whitelistValidation');
  });
});
