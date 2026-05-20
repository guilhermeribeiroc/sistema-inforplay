'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ShoppingCart, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import ProductSearch, { type CartItem } from '@/components/forms/ProductSearch'
import CustomerSearch from '@/components/forms/CustomerSearch'

const paymentMethods = [
  { value: 'pix',         label: 'PIX',       color: '#22c55e' },
  { value: 'cash',        label: 'Dinheiro',  color: '#0ea5e9' },
  { value: 'credit_card', label: 'Crédito',   color: '#6366f1' },
  { value: 'debit_card',  label: 'Débito',    color: '#f59e0b' },
  { value: 'transfer',    label: 'Transfer.', color: '#64748b' },
]

export default function NovaVendaPage() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [payment, setPayment] = useState('pix')
  const [notes, setNotes] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const total = Math.max(0, subtotal - discount)

  async function handleSubmit() {
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

      const { data: sale, error } = await supabase.from('sales').insert({
        customer_name: customerName.trim() || 'Cliente Avulso',
        customer_phone: customerPhone || null,
        employee_id: user!.id,
        employee_name: profile?.name,
        status: 'completed',
        subtotal, discount,
        discount_percent: subtotal > 0 ? (discount / subtotal) * 100 : 0,
        total,
        payment_method: payment,
        notes: notes || null,
        sale_date: new Date().toISOString().slice(0, 10),
      }).select().single() as any
      if (error) throw error

      await supabase.from('sale_items').insert(
        cart.map(i => ({
          sale_id: sale.id,
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

      toast.success(`Venda #${sale.sale_number} registrada!`)
      router.push('/vendas')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <ShoppingCart size={22} className="text-sky-500" /> Nova Venda
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
              <input className="input-field text-sm" placeholder="Observações..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Produtos / Serviços</h3>
            <ProductSearch cart={cart} onChange={setCart} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pagamento</label>
            <div className="grid grid-cols-1 gap-1.5">
              {paymentMethods.map(p => (
                <button key={p.value} onClick={() => setPayment(p.value)}
                  className="py-2 px-3 rounded-xl text-sm font-bold transition-all text-left"
                  style={{ background: payment === p.value ? p.color : '#f1f5f9', color: payment === p.value ? '#fff' : '#64748b' }}>
                  {p.label}
                </button>
              ))}
            </div>
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
            {loading ? <><Loader2 size={15} className="animate-spin" /> Registrando...</> : `Finalizar Venda · ${formatCurrency(total)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
