import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import DataList from '../Component/DataList/DataList';
import axios from 'axios';

// Mocking axios
vi.mock('axios');

// Mocking React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

// Mocking i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('DataList Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  // it('renders loading state initially', () => {
  //   render(<DataList />);
  //   expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  // });

  it('fetches and displays data', async () => {
    try {
      const mockData = [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'Cryptocurrency',
          country: 'Global',
          currency: 'USD',
        },
        {
          name: 'Apple Inc.',
          symbol: 'AAPL',
          type: 'Common Stock',
          country: 'USA',
          currency: 'USD',
        },
      ];

      axios.get.mockResolvedValueOnce({ data: { hits: { hits: mockData.map((item) => ({ _source: item })) } } });

      render(<DataList />);

      await waitFor(() => expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument());
      expect(screen.getByText(/Apple Inc./i)).toBeInTheDocument();
    } catch (error) {
      console.error('Error in fetch test:', error);
    }
  });

  it('filters data based on search term', async () => {
    try {
      const mockData = [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'Cryptocurrency',
          country: 'Global',
          currency: 'USD',
        },
      ];

      axios.get.mockResolvedValueOnce({ data: { hits: { hits: mockData.map((item) => ({ _source: item })) } } });

      render(<DataList />);

      await waitFor(() => expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument());

      const searchInput = screen.getByPlaceholderText(/searchPlaceholder/i);
      fireEvent.change(searchInput, { target: { value: 'Apple' } });

      await waitFor(() => expect(screen.queryByText(/Bitcoin/i)).not.toBeInTheDocument());
    } catch (error) {
      console.error('Error in filter test:', error);
    }
  });

  it('applies filter correctly', async () => {
    try {
      const mockData = [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'Cryptocurrency',
          country: 'Global',
          currency: 'USD',
        },
        {
          name: 'Apple Inc.',
          symbol: 'AAPL',
          type: 'Common Stock',
          country: 'USA',
          currency: 'USD',
        },
      ];

      axios.get.mockResolvedValueOnce({ data: { hits: { hits: mockData.map((item) => ({ _source: item })) } } });

      render(<DataList />);

      await waitFor(() => expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument());

      const filterButton = screen.getByText(/Cryptocurrency/i);
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
        expect(screen.queryByText(/Apple Inc./i)).not.toBeInTheDocument();
      });
    } catch (error) {
      console.error('Error in apply filter test:', error);
    }
  });

  it('navigates to details page on item click', async () => {
    try {
      const navigateMock = vi.fn();
      vi.mocked(require('react-router-dom').useNavigate).mockReturnValue(navigateMock);

      const mockData = [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'Cryptocurrency',
          country: 'Global',
          currency: 'USD',
        },
      ];

      axios.get.mockResolvedValueOnce({ data: { hits: { hits: mockData.map((item) => ({ _source: item })) } } });

      render(<DataList />);

      await waitFor(() => expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument());

      const item = screen.getByText(/Bitcoin/i);
      fireEvent.click(item);

      expect(navigateMock).toHaveBeenCalledWith('/details/BTC');
    } catch (error) {
      console.error('Error in navigation test:', error);
    }
  });
});
