'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Wrench, Loader2, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NovoTerceirizadoPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [document, setDocument] = useState('')
  const [address, setAddress] = useState('')
  const [rating, setRating] = useState(5)
  const [deliveryAvgDays, setDeliveryAvgDays] = useState(7)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const serviceTypes = [
    'Impressão', 'Corte e Vinco', 'Acabamento', 'Plotagem', 'Serigrafia',
    'Bordado', 'Laser', 'Encadernação', 'Transporte', 'Instalação', 'Outro',
  ]

  async function handleSubmit() {
    if (!name.trim()) { toast.error('Informe o nome do terceirizado.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('third_parties').insert({
        name: name.trim(),
        service: service || null,
        phone: phone || null,
        email: email || null,
        document: document || null,
        address: address || null,
        rating,
        delivery_avg_days: deliveryAvgDays,
        notes: notes || null,
        active: true,
        total_orders: 0,
        total_paid: 0,
      })
      if (error) throw error
      toast.success(`Terceirizado "${name}" cadastrado!`)
      router.push('/terceirizados')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Wrench size={22} className="text-sky-500" /> Novo Terceirizado
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Cadastrar prestador de serviço parceiro</p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome / Empresa *</label>
          <input className="input-field" placeholder="Nome do terceirizado" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo de Serviço</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {serviceTypes.map(s => (
              <button key={s} type="button" onClick={() => setService(s)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: service === s ? '#0ea5e9' : '#f1f5f9',
                  color: service === s ? '#fff' : '#64748b',
                }}>
                {s}
              </button>
            ))}
          </div>
          <input className="input-field text-sm" placeholder="Ou descreva o serviço..." value={service} onChange={e => setService(e.target.value)} />
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
          <input className="input-field" placeholder="Cidade, estado..." value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Avaliação inicial
            </label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)} className="p-0.5">
                  <Star
                    size={22}
                    fill={s <= rating ? '#f59e0b' : 'none'}
                    stroke="#f59e0b"
                    className="transition-all"
                  />
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-1">{rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prazo médio (dias)</label>
            <input
              type="number"
              className="input-field"
              placeholder="7"
              value={deliveryAvgDays}
              onChange={e => setDeliveryAvgDays(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
          <textarea className="input-field resize-none" rows={2} placeholder="Especialidades, condições, observações..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : <><Wrench size={15} /> Cadastrar Terceirizado</>}
        </button>
      </div>
    </div>
  )
}
