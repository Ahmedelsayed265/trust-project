import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChangeIndicator } from '@/shared/components/change-indicator';

describe('ChangeIndicator', () => {
  it('renders the value', () => {
    render(<ChangeIndicator value="+1.25%" />);
    expect(screen.getByText('+1.25%')).toBeInTheDocument();
  });

  it('uses success styles by default', () => {
    render(<ChangeIndicator value="+1.25%" />);
    expect(screen.getByText('+1.25%')).toHaveClass('text-success');
  });

  it('uses destructive styles when positive is false', () => {
    render(<ChangeIndicator value="-1.25%" positive={false} />);
    expect(screen.getByText('-1.25%')).toHaveClass('text-destructive');
  });
});
