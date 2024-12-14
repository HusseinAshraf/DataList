import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguageSwitcher from '../Component/LanguageSwitcher/LanguageSwitcher';  // استيراد المكون

// محاكاة i18n من react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: vi.fn((lang) => {
        console.log('Changing language to:', lang);  // طباعة اللغة عند التغيير
        localStorage.setItem('language', lang);  // محاكاة تخزين اللغة في localStorage
      }),
      language: 'en',  // محاكاة اللغة الحالية
    },
  }),
}));

describe('LanguageSwitcher component', () => {
  // محاكاة localStorage
  const setItemMock = vi.fn();
  beforeAll(() => {
    globalThis.localStorage.setItem = setItemMock;  // محاكاة localStorage.setItem
  });

  afterEach(() => {
    setItemMock.mockClear();  // مسح المحاكاة بعد كل اختبار
  });

  it('should render language button with correct text', () => {
    render(<LanguageSwitcher />);

    // تحقق من أن النص على الزر يتغير حسب اللغة (الإنجليزية أو الألمانية)
    expect(screen.getByRole('button')).toHaveTextContent('English'); // إذا كانت اللغة الإنجليزية
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

    // انقر على خيار اللغة الإنجليزية
    fireEvent.click(screen.getByLabelText('Select English'));

    // تحقق من أن اللغة تم تغييرها
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('English');
    });
  });

  it('should store the selected language in localStorage', async () => {
    render(<LanguageSwitcher />);

    // انقر على الزر لفتح القائمة
    fireEvent.click(screen.getByRole('button'));

    // انقر على خيار اللغة الألمانية
    fireEvent.click(screen.getByLabelText('Select German'));

  
    console.log('After clicking German, checking localStorage');

  });
});
