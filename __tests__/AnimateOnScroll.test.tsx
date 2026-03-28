import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimateOnScroll from '@/components/AnimateOnScroll';

// Mock motion to avoid animation complexity in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  useInView: () => true,
}));

describe('AnimateOnScroll', () => {
  it('renders children', () => {
    render(
      <AnimateOnScroll>
        <p>Hello World</p>
      </AnimateOnScroll>,
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders a motion wrapper div', () => {
    render(
      <AnimateOnScroll>
        <p>Content</p>
      </AnimateOnScroll>,
    );
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(
      <AnimateOnScroll className="custom-class">
        <p>Styled</p>
      </AnimateOnScroll>,
    );
    expect(screen.getByTestId('motion-div')).toHaveClass('custom-class');
  });
});
