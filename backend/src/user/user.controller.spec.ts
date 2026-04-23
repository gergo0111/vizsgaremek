import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    restore: vi.fn(),
    findDeleted: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
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

      const mockCreatedUser = {
        user_id: 1,
        ...createUserDto,
      };

      mockUserService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createUserDto);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('POST /users/login', () => {
    it('should login a user with correct credentials', async () => {
      const loginUserDto = {
        felhasznalonev: 'testuser',
        jelszo: 'Password123',
      };

      const mockLoginResponse = {
        message: 'Sikeres bejelentkezés',
        user: {
          user_id: 1,
          felhasznalonev: 'testuser',
          email: 'test@test.com',
          nev: 'Test User',
        },
        token: 'token-123',
      };

      mockUserService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginUserDto);

      expect(mockUserService.login).toHaveBeenCalledWith(loginUserDto);
      expect(result.message).toBe('Sikeres bejelentkezés');
      expect(result.token).toBe('token-123');
    });

    it('should reject login with invalid credentials', async () => {
      const loginUserDto = {
        felhasznalonev: 'testuser',
        jelszo: 'WrongPassword',
      };

      mockUserService.login.mockRejectedValue(
        new UnauthorizedException('Hibás felhasználónév vagy jelszó'),
      );

      await expect(controller.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('GET /users', () => {
    it('should return all active users', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', isActive: true },
        { user_id: 2, felhasznalonev: 'user2', email: 'user2@test.com', isActive: true },
      ];

      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      mockUserService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('GET /users/deleted', () => {
    it('should return all deleted users', async () => {
      const mockDeletedUsers = [
        { user_id: 1, felhasznalonev: 'deleted1', isActive: false },
        { user_id: 2, felhasznalonev: 'deleted2', isActive: false },
      ];

      mockUserService.findDeleted.mockResolvedValue(mockDeletedUsers);

      const result = await controller.findDeleted();

      expect(mockUserService.findDeleted).toHaveBeenCalled();
      expect(result).toEqual(mockDeletedUsers);
      expect(result).toHaveLength(2);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        email: 'test@test.com',
        isActive: true,
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(mockUserService.findOne).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        nev: 'Updated Name',
      };

      const mockUpdatedUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        nev: 'Updated Name',
        isActive: true,
      };

      mockUserService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update('1', updateUserDto as any);

      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(mockUpdatedUser);
      expect(result.nev).toBe('Updated Name');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const mockDeletedUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        isActive: false,
      };

      mockUserService.delete.mockResolvedValue(mockDeletedUser);

      const result = await controller.remove('1');

      expect(mockUserService.delete).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(false);
    });
  });

  describe('PATCH /users/:id/restore', () => {
    it('should restore a deleted user', async () => {
      const mockRestoredUser = {
        user_id: 1,
        felhasznalonev: 'testuser',
        isActive: true,
      };

      mockUserService.restore.mockResolvedValue(mockRestoredUser);

      const result = await controller.restore('1');

      expect(mockUserService.restore).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(true);
    });
  });
});
