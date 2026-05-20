'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, FileText, Loader2, Search, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/supabase/types'

interface CartItem { product: Product; quantity: number; unit_price: number }

export default function NovoOrcamentoPage() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [validDays, setValidDays] = useState(7)
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

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

  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + validDays)

  async function handleSubmit() {
    if (!customerName.trim()) { toast.error('Informe o nome do cliente.'); return }
    if (cart.length === 0) { toast.error('Adicione pelo menos um produto.'); return }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('id,name').eq('id', user!.id).single() as any

      const { data: quote, error } = await supabase.from('quotes').insert({
        customer_name: customerName,
        customer_phone: customerPhone || null,
        employee_id: user!.id,
        employee_name: profile?.name,
        status: 'pending',
        subtotal, discount,
        discount_percent: subtotal > 0 ? (discount / subtotal) * 100 : 0,
        total,
        valid_days: validDays,
        valid_until: validUntil.toISOString().slice(0, 10),
        notes: notes || null,
      }).select().single() as any

      if (error) throw error

      await supabase.from('quote_items').insert(
        cart.map(i => ({
          quote_id: quote.id,
          product_id: i.product.id,
          product_code: i.product.code,
          product_name: i.product.name,
          quantity: i.quantity,
          unit: i.product.unit,
          unit_price: i.unit_price,
          total_price: i.quantity * i.unit_price,
        }))
      )

      toast.success(`Orçamento #${quote.quote_number} criado com sucesso!`)
      router.push('/orcamentos')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileText size={22} className="text-sky-500" /> Novo Orçamento
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cliente *</label>
                <input className="input-field" placeholder="Nome do cliente" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
                <input className="input-field" placeholder="(88) 9 0000-0000" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
              <textarea className="input-field resize-none" rows={2} placeholder="Condições, observações..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="card p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Produtos / Serviços</label>
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
                  <p className="text-xs text-gray-400">{item.product.code} · {item.product.unit}</p>
                </div>
                <input type="number" value={item.quantity}
                  onChange={e => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: Math.max(1, Number(e.target.value)) } : i))}
                  className="w-16 input-field py-1 text-sm text-center" min={1} />
                <input type="number" value={item.unit_price}
                  onChange={e => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, unit_price: Number(e.target.value) } : i))}
                  className="w-24 input-field py-1 text-sm text-center" min={0} step={0.01} />
                <span className="text-sm font-bold text-gray-700 w-20 text-right">{formatCurrency(item.quantity * item.unit_price)}</span>
                <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
              </div>
            ))}
            {cart.length === 0 && <p className="text-center text-gray-300 text-sm py-4">Nenhum produto adicionado</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Validade (dias)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[7, 15, 30].map(d => (
                  <button key={d} onClick={() => setValidDays(d)}
                    className="py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: validDays === d ? '#0ea5e9' : '#f1f5f9', color: validDays === d ? '#fff' : '#64748b' }}>
                    {d}d
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Válido até: {validUntil.toLocaleDateString('pt-BR')}</p>
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
            {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : 'Criar Orçamento'}
          </button>
        </div>
      </div>
    </div>
  )
}
