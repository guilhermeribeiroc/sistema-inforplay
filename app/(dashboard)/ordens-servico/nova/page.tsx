'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ClipboardList, Loader2, Search, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product, ThirdParty } from '@/lib/supabase/types'

interface CartItem { product: Product; quantity: number; unit_price: number }

export default function NovaOSPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [estimatedDate, setEstimatedDate] = useState('')
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([])
  const [selectedThirdParty, setSelectedThirdParty] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('third_parties').select('id,name,service').eq('active', true).then(({ data }) => setThirdParties((data as ThirdParty[]) ?? []))
  }, [])

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      const { data } = await supabase.from('products').select('*').eq('active', true)
        .or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%`).limit(8)
      setSearchResults((data as Product[]) ?? [])
    }, 250)
    return () => clearTimeout(t)
  }, [searchQuery])

  function addToCart(p: Product) {
    setCart(prev => {
      const e = prev.find(i => i.product.id === p.id)
      return e ? prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
               : [...prev, { product: p, quantity: 1, unit_price: p.sale_price }]
    })
    setSearchQuery(''); setSearchResults([])
  }

  const subtotal = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const total = Math.max(0, subtotal - discount)

  async function handleSubmit() {
    if (!title.trim()) { toast.error('Informe o título da OS.'); return }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('id,name').eq('id', user!.id).single() as any
      const tp = thirdParties.find(t => t.id === selectedThirdParty)

      const { data: os, error } = await supabase.from('service_orders').insert({
        title, description,
        customer_name: customerName || 'Cliente Avulso',
        customer_phone: customerPhone,
        employee_id: user!.id,
        employee_name: profile?.name,
        third_party_id: selectedThirdParty || null,
        third_party_name: tp?.name ?? null,
        priority, status: 'open',
        subtotal, discount, total,
        estimated_date: estimatedDate || null,
      }).select().single() as any

      if (error) throw error

      if (cart.length > 0) {
        await supabase.from('service_order_items').insert(
          cart.map(i => ({
            os_id: os.id,
            product_id: i.product.id,
            product_code: i.product.code,
            product_name: i.product.name,
            quantity: i.quantity,
            unit: i.product.unit,
            unit_price: i.unit_price,
            cost_price: i.product.cost,
            total_price: i.quantity * i.unit_price,
          }))
        )
      }

      toast.success(`OS #${os.os_number} aberta com sucesso!`)
      router.push('/ordens-servico')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  const priorities = [
    { value: 'low', label: 'Baixa', color: '#94a3b8' },
    { value: 'normal', label: 'Normal', color: '#0ea5e9' },
    { value: 'high', label: 'Alta', color: '#f59e0b' },
    { value: 'urgent', label: 'Urgente', color: '#ef4444' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardList size={22} className="text-sky-500" /> Nova Ordem de Serviço
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título da OS *</label>
              <input className="input-field" placeholder="Ex: Banner lona 3x1 - Farmácia Central" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cliente</label>
                <input className="input-field" placeholder="Nome do cliente" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
                <input className="input-field" placeholder="(88) 9 0000-0000" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Detalhes do serviço..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Produtos */}
          <div className="card p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Materiais / Serviços</label>
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input-field pl-9" placeholder="Buscar produto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchResults.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  {searchResults.map(p => (
                    <button key={p.id} onClick={() => addToCart(p)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-sky-50 text-left">
                      <div><span className="font-mono text-xs text-sky-600 mr-2">{p.code}</span><span className="text-sm text-gray-800">{p.name}</span></div>
                      <span className="text-sm font-bold">{formatCurrency(p.sale_price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-3 py-2 border-t border-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                </div>
                <input type="number" value={item.quantity} onChange={e => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: Number(e.target.value) } : i))}
                  className="w-16 input-field py-1 text-sm text-center" min={1} />
                <span className="text-sm font-bold text-gray-700">{formatCurrency(item.quantity * item.unit_price)}</span>
                <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prioridade</label>
              <div className="grid grid-cols-2 gap-1.5">
                {priorities.map(p => (
                  <button key={p.value} onClick={() => setPriority(p.value)}
                    className="py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: priority === p.value ? p.color : '#f1f5f9', color: priority === p.value ? '#fff' : '#64748b' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prazo estimado</label>
              <input type="date" className="input-field text-sm" value={estimatedDate} onChange={e => setEstimatedDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Terceirizado</label>
              <select className="input-field text-sm" value={selectedThirdParty} onChange={e => setSelectedThirdParty(e.target.value)}>
                <option value="">Nenhum</option>
                {thirdParties.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="card p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Desconto (R$)</label>
              <input type="number" className="input-field text-sm" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={0} />
            </div>
            <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
              <span>Total</span><span className="text-sky-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : 'Abrir Ordem de Serviço'}
          </button>
        </div>
      </div>
    </div>
  )
}
