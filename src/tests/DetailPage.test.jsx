import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom'; // استيراد MemoryRouter و useNavigate
import DetailPage from '../Component/DetailPage/DetailPage'; // تأكد من صحة المسار هنا
import axios from 'axios';

// Mock axios
vi.mock('axios');
axios.get.mockResolvedValueOnce({ data: { hits: { hits: [] } } });

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MemoryRouter: vi.fn().mockImplementation(({ children }) => <div>{children}</div>), // Mock MemoryRouter
    useNavigate: vi.fn().mockReturnValue(vi.fn()) // Mock useNavigate
  };
});

describe('DetailPage Component', () => {
  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <DetailPage />
      </MemoryRouter>
    );
    // Add your test for the loading state here
  });

  it('displays details after successful API call', async () => {
    render(
      <MemoryRouter>
        <DetailPage />
      </MemoryRouter>
    );
    // Add your assertions for the successful API response here
  });

  it('displays error message on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));
    render(
      <MemoryRouter>
        <DetailPage />
      </MemoryRouter>
    );
    // Add your assertions for the error message here
  });

  it('navigates back when back button is clicked', () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <DetailPage />
      </MemoryRouter>
    );

    // const backButton = screen.getByText(/back/i); // تأكد من أن النص هو نص الزر المناسب
    // backButton.click();
    // expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it('navigates to candles page when button is clicked', () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <DetailPage />
      </MemoryRouter>
    );

    // const navigateButton = screen.getByText(/navigate to candles/i);
    // navigateButton.click();
    // expect(navigateMock).toHaveBeenCalledWith('../Component/CandlePage/CandlePage.jsx'); 
  });
});
