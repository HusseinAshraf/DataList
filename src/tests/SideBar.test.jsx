import { render, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SideBar from '../Component/SideBar/SideBar';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // دالة mock ترجع الـ key مباشرة
  }),
}));

describe('SideBar Component', () => {
  const onFilterChange = vi.fn();
  const types = ['Common Stock', 'Cryptocurrency', 'Fund'];

  it('should render the sidebar with correct default state', () => {
    render(<SideBar types={types} onFilterChange={onFilterChange} selectedFilter={null} />);

    // تحقق من أن العنوان "filterByType" تم عرضه
    expect(screen.getByText('filterByType')).toBeInTheDocument();

    // تحقق من أن الزر "all" تم عرضه
    const allButton = screen.getByText('all');
    expect(allButton).toBeInTheDocument();

    // تحقق من أن الزر "all" لا يحتوي على الكلاس bg-blue-600 عند عدم تحديد فلتر
    expect(allButton).not.toHaveClass('bg-blue-600');
  });

  it('should open and close the sidebar when the toggle button is clicked', () => {
    render(<SideBar types={types} onFilterChange={onFilterChange} selectedFilter={null} />);

    // تحقق من أن الشريط الجانبي مخفي في البداية (يحتوي على الكلاس -translate-x-full)
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveClass('-translate-x-full');

    // محاكاة النقر على زر التبديل لفتح الشريط الجانبي
    fireEvent.click(screen.getByRole('button'));
    expect(sidebar).toHaveClass('translate-x-0');

    // محاكاة النقر في الخارج لإغلاق الشريط الجانبي
    fireEvent.click(screen.getByText('filterByType'));
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('should highlight the selected filter', () => {
    render(<SideBar types={types} onFilterChange={onFilterChange} selectedFilter="Cryptocurrency" />);

    // تحقق من أن زر "Cryptocurrency" يحتوي على الكلاس bg-blue-600
    const cryptoButton = screen.getByText('Cryptocurrency');
    expect(cryptoButton).toHaveClass('bg-blue-600');  // تحقق من أنه مميز

    // محاكاة النقر على الزر
    fireEvent.click(cryptoButton);
    expect(onFilterChange).toHaveBeenCalledWith('Cryptocurrency');
  });

  it('should render the correct icons for each filter type', () => {
    render(<SideBar types={types} onFilterChange={onFilterChange} selectedFilter={null} />);

    // تحقق من أن الأيقونات يتم عرضها بشكل صحيح
    expect(screen.getByText('Common Stock')).toContainHTML('<svg'); // تحقق من وجود الأيقونة
    expect(screen.getByText('Cryptocurrency')).toContainHTML('<svg'); // تحقق من وجود الأيقونة
    expect(screen.getByText('Fund')).toContainHTML('<svg'); // تحقق من وجود الأيقونة
  });

  it('should call the onFilterChange with the correct type when a filter is clicked', () => {
    render(<SideBar types={types} onFilterChange={onFilterChange} selectedFilter={null} />);

    // محاكاة النقر على فلتر "Cryptocurrency"
    fireEvent.click(screen.getByText('Cryptocurrency'));
    expect(onFilterChange).toHaveBeenCalledWith('Cryptocurrency');
  });
});
