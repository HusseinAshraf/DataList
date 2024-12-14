import { render } from '@testing-library/react';
import Loading from '../Component/Loading/Loading';
import { describe, it, expect } from 'vitest';

describe('Loading component', () => {
  it('should render a loading spinner', () => {
    const { container } = render(<Loading />);
    // تحقق من وجود العنصر الدائري المتحرك
    const spinner = container.querySelector('.spinner-border');
    expect(spinner).toBeInTheDocument(); // تأكد أن العنصر موجود
    expect(spinner).toHaveClass('animate-spin'); // تحقق من أن الأنميشن تم تطبيقه
  });
});
