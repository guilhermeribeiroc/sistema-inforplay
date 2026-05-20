'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, UserCog, Loader2, Save, Eye, EyeOff, ShieldOff } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/lib/supabase/types'

export default function EditarFuncionarioPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [monthlyGoal, setMonthlyGoal] = useState(0)
  const [active, setActive] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resettingPwd, setResettingPwd] = useState(false)
  const [deactivating, setDeactivating] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('profiles').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) { toast.error('Funcionário não encontrado'); router.push('/funcionarios'); return }
        const p = data as Profile
        setProfile(p)
        setName(p.name)
        setPhone(p.phone ?? '')
        setMonthlyGoal(p.monthly_goal ?? 0)
        setActive(p.active)
        setLoading(false)
      })
  }, [id])

  async function handleSave() {
    if (!name.trim()) { toast.error('Informe o nome.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('profiles').update({
        name: name.trim(),
        phone: phone || null,
        monthly_goal: monthlyGoal,
        updated_at: new Date().toISOString(),
      }).eq('id', id)
      if (error) throw error
      toast.success('Dados atualizados!')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setSaving(false) }
  }

  async function handleResetPassword() {
    if (!newPassword || newPassword.length < 6) { toast.error('A senha deve ter no mínimo 6 caracteres.'); return }
    setResettingPwd(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('reset_employee_password', {
        p_user_id: id,
        p_new_password: newPassword,
      })
      if (error) throw error
      toast.success('Senha redefinida com sucesso!')
      setNewPassword('')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setResettingPwd(false) }
  }

  async function handleDeactivate() {
    if (!confirm(`Desativar "${name}"? O acesso ao sistema será bloqueado.`)) return
    setDeactivating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('delete_employee_user', { p_user_id: id })
      if (error) throw error
      toast.success('Funcionário desativado.')
      router.push('/funcionarios')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setDeactivating(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-sky-500" />
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <UserCog size={22} className="text-sky-500" /> Editar Funcionário
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{profile?.email}</p>
        </div>
      </div>

      {/* Dados */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Informações</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome completo *</label>
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
            <input className="input-field" placeholder="(88) 9 0000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meta Mensal (R$)</label>
            <input type="number" className="input-field" value={monthlyGoal || ''} onChange={e => setMonthlyGoal(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'badge-ready' : 'badge-cancelled'}`}>
            {active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-2.5">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : <><Save size={14} /> Salvar Alterações</>}
        </button>
      </div>

      {/* Reset senha */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Redefinir Senha</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nova senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button onClick={handleResetPassword} disabled={resettingPwd} className="btn-primary w-full py-2.5">
          {resettingPwd ? <><Loader2 size={14} className="animate-spin" /> Redefinindo...</> : 'Redefinir Senha'}
        </button>
      </div>

      {/* Zona de perigo */}
      <div className="card p-5 space-y-3" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
        <h3 className="font-bold text-red-600 text-sm flex items-center gap-2"><ShieldOff size={15} /> Zona de Perigo</h3>
        <p className="text-xs text-gray-500">Desativar bloqueia o acesso ao sistema. O histórico de vendas e OS é mantido.</p>
        <button onClick={handleDeactivate} disabled={deactivating}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          {deactivating ? <><Loader2 size={14} className="animate-spin" /> Desativando...</> : <><ShieldOff size={14} /> Desativar Funcionário</>}
        </button>
      </div>
    </div>
  )
}
