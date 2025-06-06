import { Test, TestingModule } from '@nestjs/testing';
import argon from 'argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from './auth.service';

const mockPrisma = {
  token: {
    create: vi.fn(),
  },
  user: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
};

vi.mock('argon2', () => {
  return {
    default: {
      hash: vi.fn().mockResolvedValue('hashed_password'),
      verify: vi.fn().mockResolvedValue(true),
    },
  };
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'PrismaService',
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    service['prisma'] = mockPrisma as any;

    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(service.login({ password: 'pass', username: 'test' })).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw BadRequestException if password invalid', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        password: 'hashed',
        username: 'test',
      });
      (argon.verify as any).mockResolvedValue(false);

      await expect(service.login({ password: 'wrong', username: 'test' })).rejects.toThrow(
        'Invalid password or username',
      );
    });

    it('should return user and token if login successful', async () => {
      const mockUser = {
        email: 'test@example.com',
        id: '1',
        password: 'hashed',
        username: 'test',
      };
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      (argon.verify as any).mockResolvedValue(true);
      mockPrisma.token.create.mockResolvedValue({ token: 'jwt-token' });

      const result = await service.login({
        password: 'pass',
        username: 'test',
      });

      expect(result).toEqual({
        ...mockUser,
        token: 'jwt-token',
      });
    });
  });

  describe('register', () => {
    it('should throw BadRequestException if user exists', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: '1' });

      await expect(
        service.register({
          displayName: 'User',
          email: 'email@test.com',
          password: 'pass',
          username: 'user',
        }),
      ).rejects.toThrow('User already exists');
    });

    it('should create first user with ADMIN and USER roles', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null); // no user exists
      (argon.hash as any).mockResolvedValue('hashed-pass');
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        roles: ['ADMIN', 'USER'],
        username: 'user',
      });

      const user = await service.register({
        displayName: 'User',
        email: 'email@test.com',
        password: 'pass',
        username: 'user',
      });

      expect(user.roles).toContain('ADMIN');
      expect(user.roles).toContain('USER');
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: 'hashed-pass',
            roles: ['ADMIN', 'USER'],
          }),
        }),
      );
    });

    it('should create user with only USER role if not first user', async () => {
      mockPrisma.user.findFirst
        .mockResolvedValueOnce(null) // isExist: kullanıcı yok
        .mockResolvedValueOnce({ id: 'exist' }); // isFirstUser: kullanıcı var

      (argon.hash as any).mockResolvedValue('hashed-pass');
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        roles: ['USER'],
        username: 'user',
      });

      const user = await service.register({
        displayName: 'User',
        email: 'email@test.com',
        password: 'pass',
        username: 'user',
      });

      expect(user.roles).toContain('USER');
      expect(user.roles).not.toContain('ADMIN');

      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: 'hashed-pass',
            roles: ['USER'],
          }),
        }),
      );
    });
  });
});
