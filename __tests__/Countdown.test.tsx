import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Countdown from '@/components/Countdown';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders days, hours, minutes, and seconds', () => {
    const targetDate = new Date('2026-07-15T21:00:00');
    const now = new Date(
      targetDate.getTime() -
        (2 * 86400000 + 3 * 3600000 + 30 * 60000 + 15 * 1000),
    );
    vi.setSystemTime(now);

    render(<Countdown targetDate="2026-07-15T21:00:00" />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Dias')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Horas')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Minutos')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Segundos')).toBeInTheDocument();
  });

  it('shows zeroes when the event date has passed', () => {
    const pastDate = '2020-01-01T00:00:00';
    vi.setSystemTime(new Date('2026-06-01'));

    render(<Countdown targetDate={pastDate} />);

    const zeroes = screen.getAllByText('0');
    expect(zeroes.length).toBe(4);
  });

  it('updates every second', () => {
    const targetDate = new Date('2026-07-15T21:00:00');
    const now = new Date(targetDate.getTime() - 10000);
    vi.setSystemTime(now);

    render(<Countdown targetDate="2026-07-15T21:00:00" />);
    expect(screen.getByText('10')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
