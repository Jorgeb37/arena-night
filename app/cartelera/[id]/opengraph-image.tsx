import { ImageResponse } from 'next/og';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export const runtime = 'edge';
export const alt = 'Fight Detail — Arena Night';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fight = (fights as Fight[]).find((f) => f.id === id);

  if (!fight) {
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#030712',
          color: '#ffffff',
          fontSize: 48,
          fontWeight: 900,
        }}
      >
        Arena Night
      </div>,
      { ...size },
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
          }}
        >
          {fight.fighter1.name}
        </span>
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#f59e0b',
          }}
        >
          VS
        </span>
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
          }}
        >
          {fight.fighter2.name}
        </span>
      </div>
      <span
        style={{
          fontSize: 28,
          color: '#9ca3af',
          marginTop: 24,
        }}
      >
        {fight.category}
      </span>
      <span
        style={{
          fontSize: 24,
          color: '#6b7280',
          marginTop: 16,
        }}
      >
        Arena Night — 15 de Julio, 2026
      </span>
    </div>,
    { ...size },
  );
}
