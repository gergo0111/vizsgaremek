import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

vi.mock('argon2', () => ({
  verify: vi.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  const mockAuthService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
  };

  const mockUserService = {
    findByEmail: vi.fn(),
    createToken: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('POST /auth/login', () => {
    it('should login user with valid credentials', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'ValidPassword123',
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed_password',
      };

      const mockToken = {
        token: 'token-123',
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as any).mockResolvedValue(true);
      mockUserService.createToken.mockResolvedValue(mockToken);

      const result = await controller.login(loginDto as any);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, loginDto.password);
      expect(mockUserService.createToken).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ token: mockToken });
    });

    it('should reject login when user does not exist', async () => {
      const loginDto = {
        email: 'nonexistent@test.com',
        password: 'Password123',
      };

      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(controller.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
      await expect(controller.login(loginDto as any)).rejects.toThrow('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'WrongPassword',
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed_password',
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as any).mockResolvedValue(false);

      await expect(controller.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('GET /auth', () => {
    it('should return all auth', () => {
      mockAuthService.findAll.mockReturnValue('This action returns all auth');

      const result = controller.findAll();

      expect(mockAuthService.findAll).toHaveBeenCalled();
      expect(result).toBe('This action returns all auth');
    });
  });

  describe('GET /auth/:id', () => {
    it('should return a single auth', () => {
      mockAuthService.findOne.mockReturnValue('This action returns a #1 auth');

      const result = controller.findOne('1');

      expect(mockAuthService.findOne).toHaveBeenCalledWith(1);
      expect(result).toContain('1');
    });
  });

  describe('PATCH /auth/:id', () => {
    it('should update auth', () => {
      const updateAuthDto = {};
      mockAuthService.update.mockReturnValue('This action updates a #1 auth');

      const result = controller.update('1', updateAuthDto as any);

      expect(mockAuthService.update).toHaveBeenCalledWith(1, updateAuthDto);
      expect(result).toContain('1');
    });
  });
});
