import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrismaUser = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockPrismaToken = {
    create: vi.fn(),
  };

  const mockPrisma = {
    user: mockPrismaUser,
    token: mockPrismaToken,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    prismaService = mockPrisma as any;
    userService = new UserService(prismaService);
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', isActive: true },
        { user_id: 2, felhasznalonev: 'user2', email: 'user2@test.com', isActive: true },
      ];

      mockPrismaUser.findMany.mockResolvedValue(mockUsers);

      const result = await userService.findAll();

      expect(mockPrismaUser.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no active users exist', async () => {
      mockPrismaUser.findMany.mockResolvedValue([]);

      const result = await userService.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaUser.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        email: 'test@test.com',
        isActive: true,
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findOne(1);

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await userService.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        felhasznalonev: 'newuser',
        email: 'new@test.com',
        jelszo: 'Password123',
        nev: 'New User',
        munkakor: 'Developer',
        munkaora: 8,
        isActive: false,
        isAdmin: false,
      };

      const hashedPassword = 'hashed_password_123';
      const mockCreatedUser = {
        user_id: 1,
        ...createUserDto,
        jelszo: hashedPassword,
        isActive: false,
        isAdmin: false,
      };

      (bcrypt.hash as any).mockResolvedValue(hashedPassword);
      mockPrismaUser.create.mockResolvedValue(mockCreatedUser);

      const result = await userService.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.jelszo, 10);
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          jelszo: hashedPassword,
        },
      });
      expect(result.jelszo).toBe(hashedPassword);
    });

    it('should throw error on database failure', async () => {
      const createUserDto = {
        felhasznalonev: 'newuser',
        email: 'new@test.com',
        jelszo: 'Password123',
        nev: 'New User',
        munkakor: 'Developer',
        munkaora: 8,
        isActive: false,
        isAdmin: false,
      };

      (bcrypt.hash as any).mockResolvedValue('hashed_password');
      mockPrismaUser.create.mockRejectedValue(new Error('Database error'));

      await expect(userService.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update user without password change', async () => {
      const updateUserDto = {
        nev: 'Updated Name',
        munkakor: 'Senior Developer',
      };

      const mockUpdatedUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        email: 'test@test.com',
        ...updateUserDto,
      };

      mockPrismaUser.update.mockResolvedValue(mockUpdatedUser);

      const result = await userService.update(1, updateUserDto);

      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: updateUserDto,
      });
      expect(result).toEqual(mockUpdatedUser);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should update user with new hashed password', async () => {
      const updateUserDto = {
        jelszo: 'newpassword123',
      };

      const hashedPassword = 'hashed_new_password';
      const mockUpdatedUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        email: 'test@test.com',
        jelszo: hashedPassword,
      };

      (bcrypt.hash as any).mockResolvedValue(hashedPassword);
      mockPrismaUser.update.mockResolvedValue(mockUpdatedUser);

      const result = await userService.update(1, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      const hashCall = (bcrypt.hash as any).mock.calls[0];
      expect(hashCall[0]).toBe('newpassword123');
      expect(hashCall[1]).toBe(10);
      
      expect(mockPrismaUser.update).toHaveBeenCalled();
      const updateCall = (mockPrismaUser.update as any).mock.calls[0][0];
      expect(updateCall.where.user_id).toBe(1);
      expect(updateCall.data.jelszo).toBe(hashedPassword);
      expect(result.jelszo).toBe(hashedPassword);
    });
  });

  describe('delete', () => {
    it('should soft delete a user by setting isActive to false', async () => {
      const mockDeletedUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        isActive: false,
      };

      mockPrismaUser.update.mockResolvedValue(mockDeletedUser);

      const result = await userService.delete(1);

      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a user by setting isActive to true', async () => {
      const mockRestoredUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        isActive: true,
      };

      mockPrismaUser.update.mockResolvedValue(mockRestoredUser);

      const result = await userService.restore(1);

      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('findDeleted', () => {
    it('should return all inactive users', async () => {
      const mockDeletedUsers = [
        { user_id: 1, felhasznalonev: 'deleted1', isActive: false },
        { user_id: 2, felhasznalonev: 'deleted2', isActive: false },
      ];

      mockPrismaUser.findMany.mockResolvedValue(mockDeletedUsers);

      const result = await userService.findDeleted();

      expect(mockPrismaUser.findMany).toHaveBeenCalledWith({
        where: { isActive: false },
      });
      expect(result).toEqual(mockDeletedUsers);
      expect(result).toHaveLength(2);
    });
  });

  describe('login', () => {
    const loginDto = {
      felhasznalonev: 'testuser',
      jelszo: 'password123',
    };

    const mockUser = {
      user_id: 1,
      felhasznalonev: 'testuser',
      email: 'test@test.com',
      jelszo: 'hashed_password',
      nev: 'Test User',
    };

    const mockToken = {
      token: 'uuid-token-123',
      user_id: 1,
    };

    it('should successfully login a user with correct credentials', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrismaToken.create.mockResolvedValue(mockToken);

      const result = await userService.login(loginDto);

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { felhasznalonev: loginDto.felhasznalonev },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.jelszo, mockUser.jelszo);
      expect(mockPrismaToken.create).toHaveBeenCalled();
      expect(result.message).toBe('Sikeres bejelentkezés');
      expect(result.user).not.toHaveProperty('jelszo');
      expect(result.token).toBe(mockToken.token);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(userService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Hibás felhasználónév vagy jelszó'),
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(userService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Hibás felhasználónév vagy jelszó'),
      );
    });

    it('should not return password in login response', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockPrismaToken.create.mockResolvedValue(mockToken);

      const result = await userService.login(loginDto);

      expect(result.user).not.toHaveProperty('jelszo');
      expect(result.user.felhasznalonev).toBe(mockUser.felhasznalonev);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        email: 'test@test.com',
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findByEmail('test@test.com');

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user with email does not exist', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await userService.findByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });

  describe('createToken', () => {
    it('should create a token for user', async () => {
      const mockToken = {
        token: 'uuid-token-123',
        user_id: 1,
      };

      mockPrismaToken.create.mockResolvedValue(mockToken);

      const result = await userService.createToken(1);

      expect(mockPrismaToken.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          user_id: 1,
        },
      });
      expect(result.token).toBeDefined();
      expect(result.user_id).toBe(1);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      (bcrypt.compare as any).mockResolvedValue(true);

      const result = await userService.verifyPassword('password123', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      (bcrypt.compare as any).mockResolvedValue(false);

      const result = await userService.verifyPassword('wrongpassword', 'hashed_password');

      expect(result).toBe(false);
    });
  });
});
