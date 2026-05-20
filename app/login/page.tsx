'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('E-mail ou senha incorretos. Tente novamente.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0f1729 40%, #162035 70%, #1e2d4a 100%)' }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: 600, height: 600, left: '-10%', top: '-20%',
            background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
            animation: mounted ? 'pulse 8s ease-in-out infinite' : undefined,
          }}
        />
        <div
          className="absolute rounded-full opacity-15 blur-3xl"
          style={{
            width: 500, height: 500, right: '-5%', bottom: '-15%',
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            animation: mounted ? 'pulse 10s ease-in-out infinite 2s' : undefined,
          }}
        />
        <div
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: 400, height: 400, left: '40%', top: '30%',
            background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)',
            animation: mounted ? 'pulse 12s ease-in-out infinite 4s' : undefined,
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-md mx-4 z-10"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div className="glass rounded-3xl p-8" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex flex-col items-center gap-3 mb-2">
              {/* Logo + nome */}
              <div className="flex items-center gap-3">
                <div style={{
                  background: 'linear-gradient(135deg,rgba(14,165,233,0.15),rgba(99,102,241,0.15))',
                  border: '1px solid rgba(14,165,233,0.25)',
                  borderRadius: 16,
                  padding: 6,
                }}>
                  <Image src="/logo.svg" alt="Inforplay" width={52} height={52} style={{ borderRadius: 10 }} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight leading-none">INFORPLAY</h1>
                  <p className="text-xs font-medium mt-1" style={{ color: 'rgba(14,165,233,0.8)', letterSpacing: '0.12em' }}>
                    PAPELARIA · INFORMÁTICA · GRÁFICA
                  </p>
                </div>
              </div>
              {/* Lojas */}
              <div className="flex items-center gap-4 mt-1">
                {[
                  { city: 'Morada Nova', street: 'Cel. José Epifânio, 109' },
                  { city: 'Limoeiro do Norte', street: 'Prof. Ricarte, 486' },
                ].map((l, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: '0.06em' }}>{l.city.toUpperCase()}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{l.street}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px w-full mt-5 mb-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }} />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Faça login para acessar o painel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                E-mail
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    caretColor: '#0ea5e9',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(14,165,233,0.6)'
                    e.target.style.background = 'rgba(14,165,233,0.06)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.06)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Senha
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-11 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    caretColor: '#0ea5e9',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(14,165,233,0.6)'
                    e.target.style.background = 'rgba(14,165,233,0.06)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.06)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: loading
                  ? 'rgba(14,165,233,0.4)'
                  : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#fff',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(14,165,233,0.45)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.35)'
                }
              }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Entrando...</>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Inforplay © {new Date().getFullYear()} · Papelaria · Informática · Gráfica Rápida
          </p>
        </div>

        {/* Floating info badge */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.9), rgba(99,102,241,0.9))',
            color: '#fff',
            boxShadow: '0 2px 12px rgba(14,165,233,0.4)',
          }}
        >
          Sistema Interno
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  )
}
