import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Arena Night — Boxing & Music Event';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
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
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.05em',
          }}
        >
          Arena
        </span>
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#f59e0b',
            letterSpacing: '-0.05em',
          }}
        >
          Night
        </span>
      </div>
      <span
        style={{
          fontSize: 32,
          color: '#9ca3af',
          marginTop: 16,
        }}
      >
        15 de Julio, 2026 — Boxing & Music
      </span>
    </div>,
    { ...size },
  );
}
