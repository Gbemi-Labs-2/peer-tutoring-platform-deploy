import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { OtpService } from '../services/otp.service';
import { MailService } from '../services/mail.service';
import { UserRole } from '../../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let otpService: Partial<Record<keyof OtpService, jest.Mock>>;
  let mailService: Partial<Record<keyof MailService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      verifyEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    otpService = {
      generateOtp: jest.fn().mockResolvedValue('123456'),
      verifyOtp: jest.fn().mockResolvedValue(true),
    };

    mailService = {
      sendVerificationOtp: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: OtpService, useValue: otpService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('persists verification before issuing a token and returns the persisted profile', async () => {
    const student = { id: 'student-id', email: 'ada@example.test', role: UserRole.LEARNER, isVerified: false };
    usersService.findByEmail.mockResolvedValue(student);
    usersService.verifyEmail.mockResolvedValue({ ...student, isVerified: true });

    const result = await service.verifyOtp({ email: ' ADA@example.test ', code: '123456' });

    expect(otpService.verifyOtp).toHaveBeenCalledWith('ada@example.test', '123456');
    expect(usersService.verifyEmail).toHaveBeenCalledWith(student.id);
    expect(usersService.verifyEmail.mock.invocationCallOrder[0]).toBeLessThan(jwtService.sign.mock.invocationCallOrder[0]);
    expect(result.user.isVerified).toBe(true);
    expect(student.isVerified).toBe(false);
  });

  it('does not verify the user or issue a token for an invalid OTP', async () => {
    otpService.verifyOtp.mockRejectedValue(new Error('Invalid OTP'));
    await expect(service.verifyOtp({ email: 'ada@example.test', code: '000000' })).rejects.toThrow('Invalid OTP');
    expect(usersService.verifyEmail).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
