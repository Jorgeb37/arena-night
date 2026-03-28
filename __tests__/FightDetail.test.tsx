import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FightDetail from '@/components/FightDetail';
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
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockFight: Fight = {
  id: 'fight-1',
  fighter1: { name: 'El Titan', image: '/fighters/titan.svg', record: '5-1' },
  fighter2: { name: 'Shadow', image: '/fighters/shadow.svg', record: '4-2' },
  category: 'Peso medio',
  time: '21:00',
  status: 'upcoming',
};

describe('FightDetail', () => {
  it('renders both fighter names', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('El Titan')).toBeInTheDocument();
    expect(screen.getByText('Shadow')).toBeInTheDocument();
  });

  it('renders fighter records', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('5-1')).toBeInTheDocument();
    expect(screen.getByText('4-2')).toBeInTheDocument();
  });

  it('renders category and time', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('Peso medio')).toBeInTheDocument();
    expect(screen.getByText('21:00')).toBeInTheDocument();
  });

  it('renders VS separator', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('renders back link to cartelera', () => {
    render(<FightDetail fight={mockFight} />);
    const backLink = screen.getByText(/Volver a cartelera/);
    expect(backLink.closest('a')).toHaveAttribute('href', '/cartelera');
  });

  it('renders vote CTA link', () => {
    render(<FightDetail fight={mockFight} />);
    const voteLink = screen.getByText(/Votar en este combate/);
    expect(voteLink.closest('a')).toHaveAttribute('href', '/votaciones');
  });
});
