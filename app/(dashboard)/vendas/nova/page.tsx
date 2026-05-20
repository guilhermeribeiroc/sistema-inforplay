'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Search, Plus, Trash2, ShoppingCart, ChevronLeft, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/supabase/types'

interface CartItem {
  product: Product
  quantity: number
  unit_price: number
}

const paymentMethods = [
  { value: 'pix',         label: 'PIX' },
  { value: 'cash',        label: 'Dinheiro' },
  { value: 'credit_card', label: 'Cartão Crédito' },
  { value: 'debit_card',  label: 'Cartão Débito' },
  { value: 'transfer',    label: 'Transferência' },
]

export default function NovaVendaPage() {
  const router = useRouter()
  const supabase = createClient()
  const searchRef = useRef<HTMLInputElement>(null)

  const [customerName, setCustomerName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Busca de produtos com debounce
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%`)
        .limit(8)
      setSearchResults((data as Product[]) ?? [])
    }, 250)
    return () => clearTimeout(t)
  }, [searchQuery])

  function addToCart(product: Product) {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1, unit_price: product.sale_price }]
    })
    setSearchQuery('')
    setSearchResults([])
    searchRef.current?.focus()
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(i => i.product.id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) { removeFromCart(id); return }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
  }

  function updatePrice(id: string, price: number) {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, unit_price: price } : i))
  }

  const subtotal = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const total = Math.max(0, subtotal - discount)

  async function handleSubmit() {
    if (cart.length === 0) { toast.error('Adicione pelo menos um produto.'); return }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('id,name').eq('id', user!.id).single() as any

      const { data: sale, error } = await supabase.from('sales').insert({
        customer_name: customerName || 'Cliente Avulso',
        employee_id: user!.id,
        employee_name: profile?.name ?? '',
        status: 'completed',
        subtotal,
        discount,
        total,
        payment_method: paymentMethod,
        notes,
        sale_date: new Date().toISOString().split('T')[0],
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
      router.push('/')
    } catch (e: any) {
      toast.error('Erro ao registrar venda: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingCart size={22} className="text-sky-500" /> Nova Venda
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Registre uma venda rapidamente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: produtos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cliente */}
          <div className="card p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cliente</label>
            <input
              className="input-field"
              placeholder="Nome do cliente (opcional)"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
            />
          </div>

          {/* Busca de produto */}
          <div className="card p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Adicionar Produto</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                className="input-field pl-9"
                placeholder="Buscar por nome ou código..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {/* Dropdown resultados */}
              {searchResults.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-sky-50 transition-colors text-left"
                    >
                      <div>
                        <span className="font-mono text-xs text-sky-600 mr-2">{p.code}</span>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(p.sale_price)}</p>
                        <p className="text-xs text-gray-400">/{p.unit}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Carrinho */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Itens ({cart.length})</span>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-300">
                <ShoppingCart size={36} className="mx-auto mb-2" />
                <p className="text-sm">Nenhum item adicionado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {cart.map(item => (
                  <div key={item.product.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.product.code}</p>
                    </div>
                    {/* Qty */}
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-base font-bold">−</button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => updateQty(item.product.id, Number(e.target.value))}
                        className="w-14 text-center input-field py-1 text-sm"
                      />
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-base font-bold">+</button>
                    </div>
                    {/* Preço unitário */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">R$</span>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={e => updatePrice(item.product.id, Number(e.target.value))}
                        className="w-20 input-field py-1 text-sm text-right"
                        step="0.01"
                      />
                    </div>
                    {/* Total linha */}
                    <p className="w-20 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </p>
                    <button onClick={() => removeFromCart(item.product.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: resumo */}
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Resumo</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            {/* Desconto */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Desconto (R$)</label>
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="input-field text-sm"
                min={0}
                step="0.50"
              />
            </div>
            <div className="flex justify-between text-base font-black pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-sky-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Pagamento */}
          <div className="card p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Forma de Pagamento</label>
            <div className="grid grid-cols-1 gap-1.5">
              {paymentMethods.map(pm => (
                <button
                  key={pm.value}
                  onClick={() => setPaymentMethod(pm.value)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: paymentMethod === pm.value ? 'rgba(14,165,233,0.1)' : '#f8fafc',
                    color: paymentMethod === pm.value ? '#0ea5e9' : '#64748b',
                    border: paymentMethod === pm.value ? '1.5px solid rgba(14,165,233,0.3)' : '1.5px solid transparent',
                  }}
                >
                  {paymentMethod === pm.value && <Check size={13} />}
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="card p-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Observações</label>
            <textarea
              className="input-field text-sm resize-none"
              rows={2}
              placeholder="Obs. opcionais..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || cart.length === 0}
            className="btn-primary w-full py-3 text-base"
            style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : <>Finalizar Venda · {formatCurrency(total)}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
