import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';

(window as any).fetch = vi.fn();

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../lib/auth', () => ({
  setUser: vi.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ((window as any).fetch as any).mockClear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the login form', () => {
      renderLogin();
      
      expect(screen.getByText('Bejelentkezés')).toBeInTheDocument();
      expect(screen.getByLabelText(/Felhasználónév/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Jelszó/i)).toBeInTheDocument();
    });

    it('should have empty input fields initially', () => {
      renderLogin();

      const usernameInput = screen.getByLabelText(/Felhasználónév/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/Jelszó/i) as HTMLInputElement;

      expect(usernameInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });

    it('should have submit button', () => {
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /Belépés/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update username input value', async () => {
      renderLogin();
      const user = userEvent.setup();

      const usernameInput = screen.getByLabelText(/Felhasználónév/i);
      await user.type(usernameInput, 'testuser');

      expect((usernameInput as HTMLInputElement).value).toBe('testuser');
    });

    it('should update password input value', async () => {
      renderLogin();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/Jelszó/i);
      await user.type(passwordInput, 'Password123');

      expect((passwordInput as HTMLInputElement).value).toBe('Password123');
    });

    it('should toggle password visibility', async () => {
      renderLogin();
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/Jelszó/i) as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: /Toggle password visibility/i });

      expect(passwordInput.type).toBe('password');

      await user.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      await user.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          message: 'Sikeres bejelentkezés',
          user: { user_id: 1, felhasznalonev: 'testuser', email: 'test@test.com' },
          token: 'test-token-123',
        }),
      };

      ((window as any).fetch as any).mockResolvedValueOnce(mockResponse);

      renderLogin();
      const user = userEvent.setup();

      const usernameInput = screen.getByLabelText(/Felhasználónév/i);
      const passwordInput = screen.getByLabelText(/Jelszó/i);
      const submitButton = screen.getByRole('button', { name: /Belépés/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect((window as any).fetch).toHaveBeenCalledWith('http://localhost:3000/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            felhasznalonev: 'testuser',
            jelszo: 'Password123',
          }),
        });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/fooldal');
      });
    });

    it('should display error message on failed login', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({
          message: 'Hibás felhasználónév vagy jelszó',
        }),
      };

      ((window as any).fetch as any).mockResolvedValueOnce(mockResponse);

      renderLogin();
      const user = userEvent.setup();

      const usernameInput = screen.getByLabelText(/Felhasználónév/i);
      const passwordInput = screen.getByLabelText(/Jelszó/i);
      const submitButton = screen.getByRole('button', { name: /Belépés/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'WrongPassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Hibás felhasználónév vagy jelszó/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      ((window as any).fetch as any).mockRejectedValueOnce(new Error('Network error'));

      renderLogin();
      const user = userEvent.setup();

      const usernameInput = screen.getByLabelText(/Felhasználónév/i);
      const passwordInput = screen.getByLabelText(/Jelszó/i);
      const submitButton = screen.getByRole('button', { name: /Belépés/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });;

  describe('Error Handling', () => {
    it('should clear previous error message on new submission', async () => {
      ((window as any).fetch as any)
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ message: 'First error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            user: { user_id: 1 },
            token: 'test-token',
          }),
        });

      renderLogin();
      const user = userEvent.setup();

      const submitButton = screen.getByRole('button', { name: /Belépés/i });
 
      await user.type(screen.getByLabelText(/Felhasználónév/i), 'testuser');
      await user.type(screen.getByLabelText(/Jelszó/i), 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/First error/i)).toBeInTheDocument();
      });

      const usernameInput = screen.getByLabelText(/Felhasználónév/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/Jelszó/i) as HTMLInputElement;

      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/First error/i)).not.toBeInTheDocument();
      });
    });
  });
});
