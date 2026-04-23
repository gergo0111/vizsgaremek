import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MainSite } from './MainSite';

vi.mock('./Menusor', () => ({
  Menusor: () => <div data-testid="menusor">Mock Menusor</div>,
}));

vi.mock('./GanntChart', () => ({
  GanntChart: () => <div data-testid="gantt-chart">Mock Gantt Chart</div>,
}));

describe('MainSite Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderMainSite = () => {
    return render(
      <BrowserRouter>
        <MainSite />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the MainSite component', () => {
      renderMainSite();

      expect(screen.getByTestId('menusor')).toBeInTheDocument();
      expect(screen.getByTestId('gantt-chart')).toBeInTheDocument();
    });

    it('should render Menusor component', () => {
      renderMainSite();

      expect(screen.getByText('Mock Menusor')).toBeInTheDocument();
    });

    it('should render GanntChart component', () => {
      renderMainSite();

      expect(screen.getByText('Mock Gantt Chart')).toBeInTheDocument();
    });

    it('should render components in correct order', () => {
      renderMainSite();

      const menusor = screen.getByTestId('menusor');
      const ganttChart = screen.getByTestId('gantt-chart');

      expect(menusor.parentElement?.children[0]).toBe(menusor);
      expect(menusor.parentElement?.children[1]).toBe(ganttChart);
    });
  });
});
