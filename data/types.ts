export interface Fighter {
  name: string;
  image: string;
  record: string;
}

export interface Fight {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  category: string;
  time: string;
  status: 'upcoming' | 'live' | 'finished';
  round?: number;
  score?: { fighter1: number; fighter2: number };
  winner?: 'fighter1' | 'fighter2';
}
