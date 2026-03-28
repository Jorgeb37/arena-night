import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Resultados — Arena Night';
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
      <span
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
        }}
      >
        Resultados en Vivo
      </span>
      <span
        style={{
          fontSize: 28,
          color: '#ef4444',
          marginTop: 16,
        }}
      >
        Actualizacion en tiempo real
      </span>
      <span
        style={{
          fontSize: 24,
          color: '#6b7280',
          marginTop: 24,
        }}
      >
        Arena Night — 15 de Julio, 2026
      </span>
    </div>,
    { ...size },
  );
}
