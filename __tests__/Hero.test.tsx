import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '@/components/Hero';

// Mock motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
  },
}));

// Mock Countdown — it's a client component with timers
vi.mock('@/components/Countdown', () => ({
  default: ({ targetDate }: { targetDate: string }) => (
    <div data-testid="countdown">{targetDate}</div>
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('Hero', () => {
  it('renders Arena Night title', () => {
    render(<Hero />);
    expect(screen.getByText('Arena')).toBeInTheDocument();
    expect(screen.getByText('Night')).toBeInTheDocument();
  });

  it('renders event date', () => {
    render(<Hero />);
    expect(
      screen.getByText('15 de Julio, 2026 — Boxing & Music'),
    ).toBeInTheDocument();
  });

  it('renders countdown', () => {
    render(<Hero />);
    expect(screen.getByTestId('countdown')).toBeInTheDocument();
  });

  it('renders CTA links', () => {
    render(<Hero />);
    expect(screen.getByText('Ver Cartelera')).toBeInTheDocument();
    expect(screen.getByText('Hacer tu Prediccion')).toBeInTheDocument();
  });
});
