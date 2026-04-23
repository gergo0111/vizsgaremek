import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUser,
  isAuthenticated,
  setUser,
  logout,
  isAdmin,
  getCurrentUser,
  getCurrentUserRole,
  type UserShape,
} from './auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    (window as any).localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  describe('getUser', () => {
    it('should return user data when stored', () => {
      const user: UserShape = { id: 1, username: 'testuser', token: 'token123' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = getUser();

      expect(result).toEqual(user);
      expect((window as any).localStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should return null when no user stored', () => {
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(null);

      const result = getUser();

      expect(result).toBeNull();
    });

    it('should return null on JSON parse error', () => {
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        'invalid-json{'
      );

      const result = getUser();

      expect(result).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      ((window as any).localStorage.getItem as any).mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = getUser();

      expect(result).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should store user data in localStorage', () => {
      const user: UserShape = { id: 1, username: 'testuser', token: 'token123' };

      setUser(user);

      expect((window as any).localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user)
      );
    });

    it('should handle complex user objects with extra fields', () => {
      const user: UserShape = {
        id: 1,
        username: 'testuser',
        token: 'token123',
        isAdmin: true,
        email: 'test@example.com',
        customField: 'customValue',
      };

      setUser(user);

      expect((window as any).localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user)
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user has token', () => {
      const user: UserShape = { id: 1, username: 'testuser', token: 'token123' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return true when user has id', () => {
      const user: UserShape = { id: 1, username: 'testuser' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return true when user has username', () => {
      const user: UserShape = { username: 'testuser' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user has no identifying info', () => {
      const user: UserShape = {};
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when no user stored', () => {
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(null);

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', () => {
      logout();

      expect((window as any).localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', () => {
      const user: UserShape = { id: 1, username: 'admin', isAdmin: true };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAdmin();

      expect(result).toBe(true);
    });

    it('should return false when user is not admin', () => {
      const user: UserShape = { id: 1, username: 'user', isAdmin: false };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAdmin();

      expect(result).toBe(false);
    });

    it('should return false when isAdmin field not present', () => {
      const user: UserShape = { id: 1, username: 'user' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = isAdmin();

      expect(result).toBe(false);
    });

    it('should return false when no user stored', () => {
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(null);

      const result = isAdmin();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const user: UserShape = { id: 1, username: 'testuser', token: 'token123' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = getCurrentUser();

      expect(result).toEqual(user);
    });

    it('should return null when no user', () => {
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(null);

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getCurrentUserRole', () => {
    it('should return admin when user is admin', () => {
      const user: UserShape = { id: 1, username: 'admin', isAdmin: true };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = getCurrentUserRole();

      expect(result).toBe('admin');
    });

    it('should return user when not admin', () => {
      const user: UserShape = { id: 1, username: 'user', isAdmin: false };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = getCurrentUserRole();

      expect(result).toBe('user');
    });

    it('should return user when no user stored', () => {
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(null);

      const result = getCurrentUserRole();

      expect(result).toBe('user');
    });

    it('should return user when isAdmin field not present', () => {
      const user: UserShape = { id: 1, username: 'user' };
      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const result = getCurrentUserRole();

      expect(result).toBe('user');
    });
  });

  describe('Integration', () => {
    it('should work with setUser and getUser together', () => {
      const user: UserShape = { id: 1, username: 'testuser', token: 'token123' };
      let storedUser: string | null = null;

      ((window as any).localStorage.getItem as any).mockImplementation((key: string) => {
        return key === 'user' ? storedUser : null;
      });

      ((window as any).localStorage.setItem as any).mockImplementation((key: string, value: string) => {
        if (key === 'user') {
          storedUser = value;
        }
      });

      setUser(user);

      ((window as any).localStorage.getItem as any).mockReturnValueOnce(
        JSON.stringify(user)
      );

      const retrieved = getUser();

      expect(retrieved).toEqual(user);
    });

    it('should work with logout and getUser together', () => {
      const user: UserShape = { id: 1, username: 'testuser', token: 'token123' };

      setUser(user);

      logout();

      expect((window as any).localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });
});
