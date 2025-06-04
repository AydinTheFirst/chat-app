import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import argon from 'argon2';

import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

// Prisma servis mock
const prismaMock = {
  user: {
    create: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock('argon2', () => {
  return {
    default: {
      hash: vi.fn().mockResolvedValue('hashed_password'),
    },
  };
});

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'PrismaService',
          useValue: prismaMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersService['prisma'] = prismaMock as any;

    vi.clearAllMocks();
  });

  it('should create user with hashed password', async () => {
    const dto: CreateUserDto = {
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      roles: ['USER'],
      username: 'testuser',
    };

    prismaMock.user.create.mockResolvedValue({
      id: '1',
      ...dto,
    });

    const result = await usersService.create(dto as any);

    expect(argon.hash).toHaveBeenCalledWith('hashed_password');

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: { ...dto, password: 'hashed_password' },
    });

    expect(result.password).toBe('hashed_password');
  });

  it('should find all users', async () => {
    const users = [{ id: '1' }, { id: '2' }];
    prismaMock.user.findMany.mockResolvedValue(users);

    const result = await usersService.findAll();

    expect(result).toBe(users);
    expect(prismaMock.user.findMany).toHaveBeenCalled();
  });

  it('should find one user by id', async () => {
    const user = { id: '1' };
    prismaMock.user.findUnique.mockResolvedValue(user);

    const result = await usersService.findOne('1');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toBe(user);
  });

  it('should throw NotFoundException when removing non-existing user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(usersService.remove('1')).rejects.toThrow(NotFoundException);
  });

  it('should remove user when exists', async () => {
    const user = { id: '1' };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.delete.mockResolvedValue(user);

    const result = await usersService.remove('1');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBe(user);
  });

  it('should throw NotFoundException when updating non-existing user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(usersService.update('1', { firstName: 'New' } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update user with hashed password', async () => {
    const user = { id: '1' };
    prismaMock.user.findUnique.mockResolvedValue(user);

    const dto: UpdateUserDto = { displayName: 'New', password: 'newpass' };
    const result = await usersService.update('1', dto);

    expect(argon.hash).toHaveBeenCalledWith('newpass');
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      data: { ...dto, password: 'hashed_password' },
      where: { id: '1' },
    });
    expect(result).toBe(user);
  });
});
