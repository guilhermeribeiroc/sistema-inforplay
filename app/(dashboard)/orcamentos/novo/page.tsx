'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, FileText, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import ProductSearch, { type CartItem } from '@/components/forms/ProductSearch'
import CustomerSearch from '@/components/forms/CustomerSearch'

export default function NovoOrcamentoPage() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [validDays, setValidDays] = useState(7)
  const [notes, setNotes] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const total = Math.max(0, subtotal - discount)
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + validDays)

  async function handleSubmit() {
    if (!customerName.trim()) { toast.error('Informe o nome do cliente.'); return }
    if (cart.length === 0) { toast.error('Adicione pelo menos um produto.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('id,name').eq('id', user!.id).single() as any

      if (customerName.trim()) {
        const { data: existing } = await supabase.from('customers')
          .select('id').ilike('name', customerName.trim()).limit(1)
        if (!existing || existing.length === 0) {
          await supabase.from('customers').insert({ name: customerName.trim(), phone: customerPhone || null })
        }
      }

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

      toast.success(`Orçamento #${quote.quote_number} criado!`)
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
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</h3>
            <CustomerSearch
              name={customerName} phone={customerPhone}
              onChangeName={setCustomerName} onChangePhone={setCustomerPhone}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações / Condições</label>
              <textarea className="input-field resize-none" rows={2} placeholder="Condições, prazo de entrega, observações..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Produtos / Serviços</h3>
            <ProductSearch cart={cart} onChange={setCart} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Validade</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[7, 15, 30].map(d => (
                <button key={d} onClick={() => setValidDays(d)}
                  className="py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ background: validDays === d ? '#0ea5e9' : '#f1f5f9', color: validDays === d ? '#fff' : '#64748b' }}>
                  {d}d
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Válido até {validUntil.toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="card p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Desconto (R$)</label>
              <input type="number" className="input-field text-sm" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={0} />
            </div>
            <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-100">
              <span>Total</span><span className="text-sky-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || cart.length === 0} className="btn-primary w-full py-3 disabled:opacity-50">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : `Criar Orçamento · ${formatCurrency(total)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
