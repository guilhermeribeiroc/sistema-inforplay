import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32, height: 32,
          borderRadius: 8,
          background: '#0f1729',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(14,165,233,0.4)',
        }}
      >
        <span style={{
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 14,
          color: 'white',
          letterSpacing: '-1px',
        }}>
          IP
        </span>
      </div>
    ),
    { ...size }
  )
}
