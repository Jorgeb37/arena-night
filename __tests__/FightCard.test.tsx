import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FightCard from '@/components/FightCard';
import type { Fight } from '@/data/types';

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockFight: Fight = {
  id: 'fight-1',
  fighter1: { name: 'El Titan', image: '/fighters/titan.svg', record: '5-1' },
  fighter2: { name: 'Shadow', image: '/fighters/shadow.svg', record: '4-2' },
  category: 'Peso medio',
  time: '21:00',
  status: 'upcoming',
};

describe('FightCard', () => {
  it('renders both fighter names', () => {
    render(<FightCard fight={mockFight} />);
    expect(screen.getByText('El Titan')).toBeInTheDocument();
    expect(screen.getByText('Shadow')).toBeInTheDocument();
  });

  it('renders fighter records', () => {
    render(<FightCard fight={mockFight} />);
    expect(screen.getByText('5-1')).toBeInTheDocument();
    expect(screen.getByText('4-2')).toBeInTheDocument();
  });

  it('renders category and time', () => {
    render(<FightCard fight={mockFight} />);
    expect(screen.getByText('Peso medio')).toBeInTheDocument();
    expect(screen.getByText('21:00')).toBeInTheDocument();
  });

  it('renders VS separator', () => {
    render(<FightCard fight={mockFight} />);
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('links to fight detail page', () => {
    render(<FightCard fight={mockFight} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/cartelera/fight-1');
  });
});
