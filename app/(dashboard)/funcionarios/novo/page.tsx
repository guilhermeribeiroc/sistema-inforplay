'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NovoFuncionarioPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [monthlyGoal, setMonthlyGoal] = useState(0)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name.trim()) { toast.error('Informe o nome completo.'); return }
    if (!email.trim()) { toast.error('Informe o e-mail.'); return }
    if (password.length < 6) { toast.error('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('create_employee_user', {
        p_email: email.trim(),
        p_password: password,
        p_name: name.trim(),
      })
      if (error) throw error

      // Update additional fields
      await supabase.from('profiles').update({
        phone: phone || null,
        monthly_goal: monthlyGoal || 0,
      }).eq('id', data)

      toast.success(`Funcionário ${name} criado com sucesso!`)
      router.push('/funcionarios')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <UserPlus size={22} className="text-sky-500" /> Novo Funcionário
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Criar conta de acesso ao sistema</p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome completo *</label>
          <input className="input-field" placeholder="Nome do funcionário" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail *</label>
          <input type="email" className="input-field" placeholder="email@inforplay.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
            <input className="input-field" placeholder="(88) 9 0000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meta Mensal (R$)</label>
            <input type="number" className="input-field" placeholder="0,00" value={monthlyGoal || ''} onChange={e => setMonthlyGoal(Number(e.target.value))} min={0} />
          </div>
        </div>

        <div className="p-3 rounded-xl text-xs text-amber-700 font-medium"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
          O funcionário poderá acessar o sistema com este e-mail e senha imediatamente.
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Criando conta...</> : <><UserPlus size={15} /> Criar Funcionário</>}
        </button>
      </div>
    </div>
  )
}
