'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, User, Lock, Bell, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ConfiguracoesPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const { data: profile } = await supabase.from('profiles').select('name,role').eq('id', user.id).single() as any
      setName(profile?.name ?? '')
      setRole(profile?.role ?? '')
      setLoading(false)
    }
    load()
  }, [])

  async function handleSaveProfile() {
    setLoadingProfile(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')
      const { error } = await supabase.from('profiles').update({ name }).eq('id', user.id)
      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally {
      setLoadingProfile(false)
    }
  }

  async function handleChangePassword() {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoadingPassword(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally {
      setLoadingPassword(false)
    }
  }

  const roleLabel: Record<string, string> = { admin: 'Administrador', employee: 'Funcionário' }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-sky-500" />
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Settings size={22} className="text-sky-500" /> Configurações
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Gerencie seu perfil e preferências</p>
      </div>

      {/* Perfil */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={16} className="text-sky-500" />
          <h3 className="font-bold text-gray-900">Dados do Perfil</h3>
        </div>

        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
            {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-900">{name || '—'}</p>
            <p className="text-sm text-gray-400">{email}</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: role === 'admin' ? '#e0f2fe' : '#f0fdf4', color: role === 'admin' ? '#0369a1' : '#15803d' }}>
              {roleLabel[role] ?? role}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome completo</label>
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
          <input className="input-field opacity-60" value={email} disabled />
          <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado por aqui.</p>
        </div>

        <button onClick={handleSaveProfile} disabled={loadingProfile} className="btn-primary">
          {loadingProfile ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : <><CheckCircle size={14} /> Salvar perfil</>}
        </button>
      </div>

      {/* Senha */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={16} className="text-sky-500" />
          <h3 className="font-bold text-gray-900">Alterar Senha</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nova senha</label>
          <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirmar nova senha</label>
          <input type="password" className="input-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" />
        </div>

        <button onClick={handleChangePassword} disabled={loadingPassword} className="btn-primary">
          {loadingPassword ? <><Loader2 size={14} className="animate-spin" /> Alterando...</> : <><Lock size={14} /> Alterar senha</>}
        </button>
      </div>

      {/* Info sistema */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-sky-500" />
          <h3 className="font-bold text-gray-900">Sobre o Sistema</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between"><span>Sistema</span><span className="font-medium text-gray-800">Inforplay Gestão</span></div>
          <div className="flex justify-between"><span>Empresa</span><span className="font-medium text-gray-800">Inforplay · Morada Nova-CE</span></div>
          <div className="flex justify-between"><span>Versão</span><span className="font-medium text-gray-800">1.0.0</span></div>
          <div className="flex justify-between"><span>Tecnologias</span><span className="font-medium text-gray-800">Next.js 16 + Supabase</span></div>
        </div>
      </div>
    </div>
  )
}
