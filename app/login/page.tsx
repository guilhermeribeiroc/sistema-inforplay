'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState<'email' | 'password' | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COLS = 28
    const ROWS = 18

    const draw = () => {
      time += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cellW = canvas.width / COLS
      const cellH = canvas.height / ROWS

      for (let c = 0; c <= COLS; c++) {
        for (let r = 0; r <= ROWS; r++) {
          const x = c * cellW
          const y = r * cellH
          const wave = Math.sin(time + c * 0.4) * Math.cos(time * 0.7 + r * 0.3)
          const alpha = (wave + 1) / 2 * 0.18 + 0.02
          const size = (wave + 1) / 2 * 1.8 + 0.4

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`
          ctx.fill()
        }
      }

      const scanY = ((time * 60) % canvas.height)
      const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.025)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 60, canvas.width, 120)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciais inválidas. Verifique e tente novamente.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080d1a;
          font-family: 'Space Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        .login-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .noise {
          position: fixed;
          inset: 0;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
          z-index: 2;
        }

        .login-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 0 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .login-wrap.ready {
          opacity: 1;
          transform: translateY(0);
        }

        /* ─── Top bar ─── */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0ea5e9;
          box-shadow: 0 0 8px 2px rgba(14,165,233,0.6);
          animation: blink 2.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .status-text {
          font-size: 10px;
          letter-spacing: 0.18em;
          color: rgba(14,165,233,0.7);
          text-transform: uppercase;
        }
        .top-bar-id {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.18);
          font-style: italic;
        }

        /* ─── Card ─── */
        .card {
          background: rgba(8, 13, 26, 0.88);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 1px solid rgba(14,165,233,0.35);
          border-radius: 4px;
          padding: 40px 36px 36px;
          position: relative;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(14,165,233,0.04),
            0 32px 80px rgba(0,0,0,0.65),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .card::before, .card::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border-color: rgba(14,165,233,0.5);
          border-style: solid;
        }
        .card::before {
          top: -1px; left: -1px;
          border-width: 2px 0 0 2px;
        }
        .card::after {
          bottom: -1px; right: -1px;
          border-width: 0 2px 2px 0;
        }

        .card-inner-corners::before, .card-inner-corners::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border-color: rgba(14,165,233,0.5);
          border-style: solid;
        }
        .card-inner-corners::before {
          top: -1px; right: -1px;
          border-width: 2px 2px 0 0;
        }
        .card-inner-corners::after {
          bottom: -1px; left: -1px;
          border-width: 0 0 2px 2px;
        }

        /* ─── Logo area ─── */
        .logo-area {
          margin-bottom: 32px;
        }
        .logo-img {
          width: auto;
          max-width: 240px;
          max-height: 110px;
          display: block;
          object-fit: contain;
          margin: 0 auto;
        }
        .logo-divider {
          height: 1px;
          margin-top: 20px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.4) 30%, rgba(14,165,233,0.12) 70%, transparent);
        }

        /* ─── Heading ─── */
        .heading {
          margin-bottom: 28px;
        }
        .heading h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #fff;
          letter-spacing: -0.02em;
          margin: 0 0 4px;
          line-height: 1.2;
        }
        .heading p {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin: 0;
          letter-spacing: 0.05em;
        }

        /* ─── Field ─── */
        .field {
          margin-bottom: 16px;
        }
        .field label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }
        .field label .lbl-marker {
          display: inline-block;
          width: 3px;
          height: 3px;
          background: rgba(14,165,233,0.8);
          border-radius: 50%;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.2);
          transition: color 0.2s;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .field-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          caret-color: #0ea5e9;
          letter-spacing: 0.02em;
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.16);
          font-style: italic;
        }
        .field-input:focus {
          border-color: rgba(14,165,233,0.5);
          background: rgba(14,165,233,0.05);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.08), inset 0 0 0 1px rgba(14,165,233,0.1);
        }
        .focused-icon {
          color: rgba(14,165,233,0.7) !important;
        }

        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
        }
        .pw-toggle:hover { color: rgba(14,165,233,0.8); }

        /* ─── Error ─── */
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 3px;
          margin-bottom: 16px;
          border-left: 2px solid rgba(239,68,68,0.5);
        }
        .error-box span {
          font-size: 11px;
          color: rgba(252,165,165,0.9);
          line-height: 1.5;
          letter-spacing: 0.02em;
        }
        .error-prefix {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          color: rgba(239,68,68,0.7);
          text-transform: uppercase;
          white-space: nowrap;
          margin-top: 1px;
        }

        /* ─── Submit ─── */
        .btn-submit {
          width: 100%;
          padding: 13px 24px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: none;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 24px rgba(14,165,233,0.3);
          position: relative;
          overflow: hidden;
          margin-top: 24px;
        }
        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        }
        .btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          box-shadow: 0 6px 32px rgba(14,165,233,0.45);
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-submit:disabled {
          background: rgba(14,165,233,0.3);
          box-shadow: none;
          cursor: not-allowed;
        }

        .spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── Footer ─── */
        .card-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-left {
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.15);
          text-transform: uppercase;
          line-height: 1.6;
        }
        .footer-right {
          font-size: 9px;
          letter-spacing: 0.08em;
          color: rgba(14,165,233,0.35);
          font-style: italic;
        }

        /* ─── Bottom label ─── */
        .bottom-label {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bottom-label-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
        .bottom-label-text {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
        }
      `}</style>

      <div className="login-root">
        <canvas
          ref={canvasRef}
          style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        />
        <div className="noise" />

        <div className={`login-wrap${mounted ? ' ready' : ''}`}>

          <div className="top-bar">
            <div className="top-bar-left">
              <div className="status-dot" />
              <span className="status-text">Sistema Online</span>
            </div>
            <span className="top-bar-id">SIS-INFORPLAY · v2</span>
          </div>

          <div className="card" style={{ position: 'relative' }}>
            <div className="card-inner-corners" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            {/* Logo */}
            <div className="logo-area">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-inforplay.png" alt="Inforplay" className="logo-img" />
              <div className="logo-divider" />
            </div>

            <div className="heading">
              <h1>Acesso ao Painel</h1>
              <p>Insira suas credenciais para continuar</p>
            </div>

            <form onSubmit={handleLogin}>

              <div className="field">
                <label>
                  <span className="lbl-marker" />
                  E-mail
                </label>
                <div className="input-wrap">
                  <span className={`input-icon${focused === 'email' ? ' focused-icon' : ''}`}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="usuario@inforplay.com.br"
                    autoComplete="email"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="field">
                <label>
                  <span className="lbl-marker" />
                  Senha
                </label>
                <div className="input-wrap">
                  <span className={`input-icon${focused === 'password' ? ' focused-icon' : ''}`}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="field-input"
                    style={{ paddingRight: '60px' }}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? 'OCULTAR' : 'EXIBIR'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <span className="error-prefix">ERR</span>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <>
                    <div className="spinner" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Entrar no Sistema
                  </>
                )}
              </button>
            </form>

            <div className="card-footer">
              <div className="footer-left">
                Inforplay © {new Date().getFullYear()}<br />
                Papelaria · Informática · Gráfica
              </div>
              <div className="footer-right">uso interno</div>
            </div>
          </div>

          <div className="bottom-label">
            <div className="bottom-label-line" />
            <span className="bottom-label-text">Acesso Restrito</span>
            <div className="bottom-label-line" />
          </div>

        </div>
      </div>
    </>
  )
}
