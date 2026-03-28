import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VoteBar from '@/components/VoteBar';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock Firebase — we test UI logic, not Firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-uid' } },
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  onSnapshot: vi.fn((_, callback) => {
    callback({
      exists: () => true,
      data: () => ({ fighter1: 60, fighter2: 40, voters: {} }),
    });
    return vi.fn(); // unsubscribe
  }),
  setDoc: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  signInAnonymously: vi.fn(() =>
    Promise.resolve({ user: { uid: 'test-uid' } }),
  ),
}));

describe('VoteBar', () => {
  it('renders fighter names as vote buttons', () => {
    render(
      <VoteBar
        fightId="fight-1"
        fighter1Name="El Titan"
        fighter2Name="Shadow"
      />,
    );

    expect(screen.getByText('El Titan')).toBeInTheDocument();
    expect(screen.getByText('Shadow')).toBeInTheDocument();
  });

  it('renders vote percentages', () => {
    render(
      <VoteBar
        fightId="fight-1"
        fighter1Name="El Titan"
        fighter2Name="Shadow"
      />,
    );

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('shows total vote count', () => {
    render(
      <VoteBar
        fightId="fight-1"
        fighter1Name="El Titan"
        fighter2Name="Shadow"
      />,
    );

    expect(screen.getByText('100 votos')).toBeInTheDocument();
  });
});
