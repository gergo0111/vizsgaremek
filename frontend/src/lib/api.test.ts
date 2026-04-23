import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiGet, apiPatch, apiPost, apiDelete } from './api';

const API_BASE_URL = 'http://localhost:3000';

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).fetch = vi.fn();
    (window as any).localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  describe('apiGet', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiGet('/test');

      expect((window as any).fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test`, {
        method: 'GET',
        headers: expect.any(Object),
      });
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed request', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(apiGet('/nonexistent')).rejects.toThrow('Not Found');
    });

    it('should include authorization header when token exists', async () => {
      const token = 'test-token-123';
      (window as any).localStorage.getItem = vi.fn(() => JSON.stringify({ token }));

      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      await apiGet('/test');

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
          }),
        })
      );
    });

    it('should not include authorization header when no token', async () => {
      (window as any).localStorage.getItem = vi.fn(() => null);

      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      await apiGet('/test');

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle empty response body', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await expect(apiGet('/test')).rejects.toThrow('HTTP 400');
    });
  });

  describe('apiPatch', () => {
    it('should patch data successfully', async () => {
      const mockData = { id: 1, name: 'Updated' };
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiPatch('/test/1', { name: 'Updated' });

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test/1`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'Updated' }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed patch', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad Request' }),
      });

      await expect(apiPatch('/test/1', {})).rejects.toThrow('Bad Request');
    });

    it('should include authorization header in patch', async () => {
      const token = 'test-token-123';
      (window as any).localStorage.getItem = vi.fn(() => JSON.stringify({ token }));

      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      await apiPatch('/test/1', { data: 'value' });

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test/1`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
          }),
        })
      );
    });
  });

  describe('apiPost', () => {
    it('should post data successfully', async () => {
      const mockData = { id: 1, name: 'New' };
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiPost('/test', { name: 'New' });

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New' }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed post', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'Conflict' }),
      });

      await expect(apiPost('/test', {})).rejects.toThrow('Conflict');
    });

    it('should include authorization header in post', async () => {
      const token = 'test-token-123';
      (window as any).localStorage.getItem = vi.fn(() => JSON.stringify({ token }));

      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      await apiPost('/test', { data: 'value' });

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
          }),
        })
      );
    });
  });

  describe('apiDelete', () => {
    it('should delete resource successfully', async () => {
      const mockData = { success: true };
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiDelete('/test/1');

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test/1`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed delete', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(apiDelete('/test/999')).rejects.toThrow('Not Found');
    });

    it('should include authorization header in delete', async () => {
      const token = 'test-token-123';
      (window as any).localStorage.getItem = vi.fn(() => JSON.stringify({ token }));

      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await apiDelete('/test/1');

      expect((window as any).fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test/1`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
          }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should use HTTP status as fallback message', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(apiGet('/test')).rejects.toThrow('HTTP 500');
    });

    it('should handle JSON parse errors gracefully', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiGet('/test')).rejects.toThrow('HTTP 500');
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      (window as any).localStorage.getItem = vi.fn(() => 'invalid-json');

      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      const result = await apiGet('/test');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('Content-Type Header', () => {
    it('should always set Content-Type to application/json', async () => {
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      await apiGet('/test');

      expect((window as any).fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });
});
