import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LiveResult from '@/components/LiveResult';
import type { Fight } from '@/data/types';

// Mock next/image for jsdom
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('LiveResult', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders "Proximo" badge for upcoming fights', () => {
    const fight: Fight = {
      id: 'fight-1',
      fighter1: {
        name: 'El Titan',
        image: '/fighters/titan.svg',
        record: '5-1',
      },
      fighter2: {
        name: 'Shadow',
        image: '/fighters/shadow.svg',
        record: '4-2',
      },
      category: 'Peso medio',
      time: '21:00',
      status: 'upcoming',
    };

    render(<LiveResult fight={fight} />);

    expect(screen.getByText('Proximo')).toBeInTheDocument();
    expect(screen.getByText('El Titan')).toBeInTheDocument();
    expect(screen.getByText('Shadow')).toBeInTheDocument();
  });

  it('renders live badge and round for live fights', () => {
    const fight: Fight = {
      id: 'fight-2',
      fighter1: { name: 'Blaze', image: '/fighters/blaze.svg', record: '6-0' },
      fighter2: {
        name: 'Vortex',
        image: '/fighters/vortex.svg',
        record: '5-1',
      },
      category: 'Peso ligero',
      time: '21:45',
      status: 'live',
      round: 3,
      score: { fighter1: 28, fighter2: 27 },
    };

    render(<LiveResult fight={fight} />);

    expect(screen.getByText('En vivo')).toBeInTheDocument();
    expect(screen.getByText('Ronda 3')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();
  });

  it('renders winner for finished fights', () => {
    const fight: Fight = {
      id: 'fight-3',
      fighter1: {
        name: 'Iron Fox',
        image: '/fighters/ironfox.svg',
        record: '3-2',
      },
      fighter2: { name: 'Rayo', image: '/fighters/rayo.svg', record: '4-1' },
      category: 'Peso welter',
      time: '22:30',
      status: 'finished',
      winner: 'fighter2',
      score: { fighter1: 25, fighter2: 30 },
    };

    render(<LiveResult fight={fight} />);

    expect(screen.getByText('Finalizado')).toBeInTheDocument();
    expect(screen.getByText('Ganador')).toBeInTheDocument();
  });
});
