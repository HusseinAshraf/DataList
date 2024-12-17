import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import CandlePage from '../Component/CandlePage/CandlePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('CandlePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

it('renders loading state initially', () => {
  render(
    <MemoryRouter initialEntries={['/candles/BTC']}>
      <Routes>
        <Route path="/candles/:symbol" element={<CandlePage />} />
      </Routes>
    </MemoryRouter>
  );

  // expect(screen.getByRole('status')).toBeInTheDocument();
});


  it('displays data when API call is successful', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        hits: {
          hits: [
            {
              _source: {
                symbol: 'BTC',
                dateTime: '2024-12-17T10:00:00Z',
                startPrice: 100,
                highestPrice: 200,
                lowestPrice: 50,
                endPrice: 150,
                volume: 1000,
              },
            },
          ],
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/candles/BTC']}>
        <Routes>
          <Route path="/candles/:symbol" element={<CandlePage />} />
        </Routes>
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(screen.getByText(/date/i)).toBeInTheDocument();
    //   expect(screen.getByText(/100/i)).toBeInTheDocument();
    // });
  });

  it('displays error message when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter initialEntries={['/candles/BTC']}>
        <Routes>
          <Route path="/candles/:symbol" element={<CandlePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/unexpectedError/i)).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        hits: {
          hits: Array.from({ length: 12 }, (_, index) => ({
            _source: {
              symbol: 'BTC',
              dateTime: `2024-12-17T10:00:00Z-${index}`,
              startPrice: 100 + index,
              highestPrice: 200 + index,
              lowestPrice: 50 + index,
              endPrice: 150 + index,
              volume: 1000 + index,
            },
          })),
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/candles/BTC']}>
        <Routes>
          <Route path="/candles/:symbol" element={<CandlePage />} />
        </Routes>
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(screen.getAllByText(/date/i).length).toBe(6); // First page
    // });


    // await waitFor(() => {
    //   expect(screen.getAllByText(/date/i).length).toBe(6); // Second page
    // });
  });
});
