'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { motion } from 'motion/react';

interface VoteBarProps {
  fightId: string;
  fighter1Name: string;
  fighter2Name: string;
}

interface VoteData {
  fighter1: number;
  fighter2: number;
  voters: Record<string, 'fighter1' | 'fighter2'>;
}

export default function VoteBar({
  fightId,
  fighter1Name,
  fighter2Name,
}: VoteBarProps) {
  const [votes, setVotes] = useState<VoteData>({
    fighter1: 0,
    fighter2: 0,
    voters: {},
  });
  const [userVote, setUserVote] = useState<'fighter1' | 'fighter2' | null>(
    null,
  );
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      if (!auth.currentUser) {
        const result = await signInAnonymously(auth);
        setUid(result.user.uid);
      } else {
        setUid(auth.currentUser.uid);
      }
    };
    authenticate();
  }, []);

  useEffect(() => {
    const voteRef = doc(db, 'votes', fightId);
    const unsubscribe = onSnapshot(voteRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as VoteData;
        setVotes(data);
        if (uid && data.voters[uid]) {
          setUserVote(data.voters[uid]);
        }
      }
    });

    return () => unsubscribe();
  }, [fightId, uid]);

  const handleVote = async (fighter: 'fighter1' | 'fighter2') => {
    if (!uid || userVote) return;

    const voteRef = doc(db, 'votes', fightId);
    const newVotes = {
      ...votes,
      [fighter]: votes[fighter] + 1,
      voters: { ...votes.voters, [uid]: fighter },
    };
    await setDoc(voteRef, newVotes);
    setUserVote(fighter);
  };

  const total = votes.fighter1 + votes.fighter2;
  const pct1 = total > 0 ? Math.round((votes.fighter1 / total) * 100) : 50;
  const pct2 = total > 0 ? 100 - pct1 : 50;

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
      <div className="mb-4 flex justify-between text-sm font-bold text-white">
        <button
          onClick={() => handleVote('fighter1')}
          disabled={userVote !== null}
          className={`transition-colors ${
            userVote === 'fighter1'
              ? 'text-amber-500'
              : userVote
                ? 'cursor-not-allowed text-gray-500'
                : 'hover:text-amber-500'
          }`}
        >
          {fighter1Name}
        </button>
        <button
          onClick={() => handleVote('fighter2')}
          disabled={userVote !== null}
          className={`transition-colors ${
            userVote === 'fighter2'
              ? 'text-amber-500'
              : userVote
                ? 'cursor-not-allowed text-gray-500'
                : 'hover:text-amber-500'
          }`}
        >
          {fighter2Name}
        </button>
      </div>
      <div className="mb-2 flex h-4 overflow-hidden rounded-full bg-gray-800">
        <motion.div
          className="bg-amber-500"
          animate={{ width: `${pct1}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <motion.div
          className="bg-gray-600"
          animate={{ width: `${pct2}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{pct1}%</span>
        <span>{total} votos</span>
        <span>{pct2}%</span>
      </div>
    </div>
  );
}
