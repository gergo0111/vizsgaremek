import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe('create', () => {
    it('should handle login DTO', () => {
      const loginDto = {
        felhasznalonev: 'testuser',
        jelszo: 'Password123',
      };

      const result = authService.create(loginDto as any);

      expect(result).toBe('This action adds a new auth');
    });
  });

  describe('findAll', () => {
    it('should return all auth message', () => {
      const result = authService.findAll();

      expect(result).toBe('This action returns all auth');
    });
  });

  describe('findOne', () => {
    it('should return a single auth message', () => {
      const result = authService.findOne(1);

      expect(result).toBe('This action returns a #1 auth');
    });

    it('should include the id in the message', () => {
      const result = authService.findOne(42);

      expect(result).toContain('42');
    });
  });

  describe('update', () => {
    it('should handle auth update', () => {
      const updateAuthDto = {
      };

      const result = authService.update(1, updateAuthDto as any);

      expect(result).toBe('This action updates a #1 auth');
    });
  });

  describe('remove', () => {
    it('should handle auth removal', () => {
      const result = authService.remove(1);

      expect(result).toBe('This action removes a #1 auth');
    });

    it('should include the id in the removal message', () => {
      const result = authService.remove(99);

      expect(result).toContain('99');
    });
  });
});
