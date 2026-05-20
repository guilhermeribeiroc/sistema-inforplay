'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, UserPlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NovoClientePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [document, setDocument] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name.trim()) { toast.error('Informe o nome do cliente.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('customers').insert({
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        document: document || null,
        address: address || null,
        city: city || null,
        state: state || null,
        notes: notes || null,
      })
      if (error) throw error
      toast.success('Cliente cadastrado com sucesso!')
      router.push('/clientes')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  const brazilStates = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <UserPlus size={22} className="text-sky-500" /> Novo Cliente
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Cadastrar cliente na base</p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome completo *</label>
          <input className="input-field" placeholder="Nome do cliente" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
            <input className="input-field" placeholder="(88) 9 0000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
            <input type="email" className="input-field" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CPF / CNPJ</label>
          <input className="input-field" placeholder="000.000.000-00" value={document} onChange={e => setDocument(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Endereço</label>
          <input className="input-field" placeholder="Rua, número, bairro..." value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cidade</label>
            <input className="input-field" placeholder="Morada Nova" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Estado</label>
            <select className="input-field" value={state} onChange={e => setState(e.target.value)}>
              <option value="">—</option>
              {brazilStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
          <textarea className="input-field resize-none" rows={2} placeholder="Anotações sobre o cliente..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : <><UserPlus size={15} /> Cadastrar Cliente</>}
        </button>
      </div>
    </div>
  )
}
