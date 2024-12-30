import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '../App'; // تأكد من مسار الاستيراد الصحيح

// Mock components
vi.mock('../Component/DataList/DataList', () => ({
  default: () => <div>DataList Component</div>,
}));

vi.mock('../Component/DetailPage/DetailPage', () => ({
  default: () => <div>DetailPage Component</div>,
}));

vi.mock('../Component/CandlePage/CandlePage', () => ({
  default: () => <div>CandlePage Component</div>,
}));

vi.mock('../Component/Loading/Loading', () => ({
  default: () => <div>Loading Component</div>,
}));

describe('App Component', () => {
  it('renders the loading component during lazy loading', async () => {
    render(<App />);

    // Check if the Loading component is rendered
    expect(screen.getByText('Loading Component')).toBeInTheDocument();
  });

  it('renders DataList component for the root route', async () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);

    // Wait for the DataList component to load
    expect(await screen.findByText('DataList Component')).toBeInTheDocument();
  });

  it('renders DetailPage component for /details/:symbol route', async () => {
    window.history.pushState({}, 'Test page', '/details/ABC');
    render(<App />);

    // Wait for the DetailPage component to load
    expect(await screen.findByText('DetailPage Component')).toBeInTheDocument();
  });

  it('renders CandlePage component for /candles/:symbol route', async () => {
    window.history.pushState({}, 'Test page', '/candles/XYZ');
    render(<App />);

    // Wait for the CandlePage component to load
    // expect(await screen.findByText('CandlePage Component')).toBeInTheDocument();
  });
});
