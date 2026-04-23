import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DeletedItems } from './DeletedItems';

vi.mock('../lib/api', () => ({
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
}));

vi.mock('./Menusor', () => ({
  Menusor: () => <div data-testid="menusor">Mock Menusor</div>,
}));

import { apiGet, apiPatch } from '../lib/api';

const mockApiGet = apiGet as any;
const mockApiPatch = apiPatch as any;

describe('DeletedItems Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiGet.mockClear();
    mockApiPatch.mockClear();
  });

  const renderDeletedItems = () => {
    return render(
      <BrowserRouter>
        <DeletedItems />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the component with tabs', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      renderDeletedItems();

      expect(screen.getByTestId('menusor')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByText('Felhasználók')).toBeInTheDocument();
        expect(screen.getByText('Munkák')).toBeInTheDocument();
        expect(screen.getByText('Feladatok')).toBeInTheDocument();
      });
    });

    it('should display loading state initially', () => {
      mockApiGet.mockImplementation(() => new Promise(() => {}));

      renderDeletedItems();

      expect(screen.getByText('Betöltés…')).toBeInTheDocument();
    });

    it('should display empty state when no deleted items', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      renderDeletedItems();

      await waitFor(() => {
        expect(screen.getByText(/Nincsenek törölt elemek/i)).toBeInTheDocument();
      });
    });

    it('should display error message on API failure', async () => {
      const error = new Error('Hiba történt a törölt elemek lekérésekor');
      mockApiGet.mockRejectedValueOnce(error);

      renderDeletedItems();

      await waitFor(() => {
        expect(screen.getByText(/Hiba történt a törölt elemek lekérésekor/i)).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('should fetch users on users tab select', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      renderDeletedItems();

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/users/deleted');
      });
    });

    it('should fetch munka on munka tab select', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      renderDeletedItems();

      const munkaTab = screen.getByText('Munkák');
      const user = userEvent.setup();

      await user.click(munkaTab);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/munka/deleted');
      });
    });

    it('should fetch feladat on feladat tab select', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      renderDeletedItems();

      const feladatTab = screen.getByText('Feladatok');
      const user = userEvent.setup();

      await user.click(feladatTab);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/feladatok/deleted');
      });
    });

    it('should fetch comment on comment tab select', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      renderDeletedItems();

      const commentTab = screen.getByText('Kommentek');
      const user = userEvent.setup();

      await user.click(commentTab);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/comment/deleted');
      });
    });
  });

  describe('Data Display', () => {
    it('should display deleted users in table', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', jelszo: 'hash' },
        { user_id: 2, felhasznalonev: 'user2', email: 'user2@test.com', jelszo: 'hash' },
      ];

      mockApiGet.mockResolvedValueOnce(mockUsers);

      renderDeletedItems();

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
      });
    });

    it('should display restore buttons for each item', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', jelszo: 'hash' },
      ];

      mockApiGet.mockResolvedValueOnce(mockUsers);

      renderDeletedItems();

      await waitFor(() => {
        const restoreButtons = screen.getAllByText('Visszaállít');
        expect(restoreButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Restore Functionality', () => {
    it('should call apiPatch on restore button click', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', jelszo: 'hash' },
      ];

      mockApiGet.mockResolvedValueOnce(mockUsers);
      mockApiPatch.mockResolvedValueOnce({});

      renderDeletedItems();
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
      });

      const restoreButton = screen.getByText('Visszaállít');
      await user.click(restoreButton);

      await waitFor(() => {
        expect(mockApiPatch).toHaveBeenCalledWith('/users/1/restore', {});
      });
    });

    it('should remove restored item from table', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', jelszo: 'hash' },
      ];

      mockApiGet.mockResolvedValueOnce(mockUsers);
      mockApiPatch.mockResolvedValueOnce({});

      renderDeletedItems();
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
      });

      const restoreButton = screen.getByText('Visszaállít');
      await user.click(restoreButton);

      await waitFor(() => {
        expect(screen.queryByText('user1')).not.toBeInTheDocument();
      });
    });

    it('should handle restore error gracefully', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1', email: 'user1@test.com', jelszo: 'hash' },
      ];

      mockApiGet.mockResolvedValueOnce(mockUsers);
      mockApiPatch.mockRejectedValueOnce(new Error('Restore failed'));

      renderDeletedItems();
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
      });

      const restoreButton = screen.getByText('Visszaállít');
      await user.click(restoreButton);

      await waitFor(() => {
        expect(screen.getByText(/Visszaállítás sikertelen/i)).toBeInTheDocument();
      });
    });
  });
});
