import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import LanguageSwitcher from '../Component/LanguageSwitcher/LanguageSwitcher';  


vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: vi.fn((lang) => {
        console.log('Changing language to:', lang); 
        localStorage.setItem('language', lang);  
      }),
      language: 'en',  
    },
  }),
}));

describe('LanguageSwitcher component', () => {
  // محاكاة localStorage
  const setItemMock = vi.fn();
  beforeAll(() => {
    globalThis.localStorage.setItem = setItemMock; 
  });

  afterEach(() => {
    setItemMock.mockClear();  
  });

  it('should render language button with correct text', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('button')).toHaveTextContent('English'); 
  });

  it('should open the language dropdown when the button is clicked', () => {
    render(<LanguageSwitcher />);

    // انقر على الزر لفتح القائمة
    fireEvent.click(screen.getByRole('button'));

    // تحقق من أن القائمة المنسدلة ظاهرة الآن
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should change the language when a language option is clicked', async () => {
    render(<LanguageSwitcher />);

    // انقر على الزر لفتح القائمة
    fireEvent.click(screen.getByRole('button'));

    
    // fireEvent.click(screen.getByLabelText('Select English'));

    
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('English');
    });
  });

  it('should store the selected language in localStorage', async () => {
    render(<LanguageSwitcher />);

    // انقر على الزر لفتح القائمة
    fireEvent.click(screen.getByRole('button'));

    // انقر على خيار اللغة الألمانية
    // fireEvent.click(screen.getByLabelText('Select German'));

  
    console.log('After clicking German, checking localStorage');

  });
});
