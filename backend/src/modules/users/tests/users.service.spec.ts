import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersRepository } from '../repositories/users.repository';
import { UserRole } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Partial<Record<keyof UsersRepository, jest.Mock>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by id', async () => {
    const mockUser = { id: 'uuid-1', email: 'test@uni.edu', role: UserRole.BOTH };
    repo.findById.mockResolvedValue(mockUser);

    const result = await service.findById('uuid-1');
    expect(result).toEqual(mockUser);
    expect(repo.findById).toHaveBeenCalledWith('uuid-1');
  });

  it('persists email verification separately from editable profile fields', async () => {
    repo.findById.mockResolvedValue({ id: 'student-id', isVerified: false });
    const verified = { id: 'student-id', isVerified: true };
    repo.update.mockResolvedValue(verified);
    expect(await service.verifyEmail('student-id')).toEqual(verified);
    expect(repo.update).toHaveBeenCalledWith('student-id', { isVerified: true });
  });
});
