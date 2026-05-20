'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ArrowUpCircle, ArrowDownCircle, Search, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/supabase/types'

export default function AjusteEstoquePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [qty, setQty] = useState('')
  const [type, setType] = useState<'in' | 'out'>('in')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).order('name')
      .then(({ data }) => { setProducts((data as Product[]) ?? []); setFiltered((data as Product[]) ?? []) })
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(q ? products.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) : products)
  }, [search, products])

  async function handleSubmit() {
    if (!selected) { toast.error('Selecione um produto.'); return }
    const n = Number(qty)
    if (!n || n <= 0) { toast.error('Informe uma quantidade válida.'); return }
    setLoading(true)
    try {
      const change = type === 'in' ? n : -n
      const { error } = await supabase.rpc('adjust_product_stock', {
        p_product_id: selected.id,
        p_quantity_change: change,
        p_reason: reason || (type === 'in' ? 'Entrada manual' : 'Saída manual'),
      })
      if (error) throw error
      toast.success(`Estoque de "${selected.name}" ajustado: ${type === 'in' ? '+' : '-'}${n} ${selected.unit}`)
      setSelected(null); setQty(''); setReason(''); setSearch('')
      supabase.from('products').select('*').eq('active', true).order('name')
        .then(({ data }) => { setProducts((data as Product[]) ?? []); setFiltered((data as Product[]) ?? []) })
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Ajuste de Estoque</h1>
          <p className="text-sm text-gray-400 mt-0.5">Registrar entrada ou saída manual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Seleção do produto */}
        <div className="card p-5 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">1. Selecione o produto</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 text-sm" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {filtered.slice(0, 30).map(p => (
              <button key={p.id} onClick={() => setSelected(p)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all"
                style={{
                  background: selected?.id === p.id ? 'rgba(14,165,233,0.1)' : 'transparent',
                  border: selected?.id === p.id ? '1px solid rgba(14,165,233,0.3)' : '1px solid transparent',
                }}>
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.code}</p>
                </div>
                <span className="text-xs font-bold" style={{ color: p.stock_quantity <= p.min_stock && p.min_stock > 0 ? '#f59e0b' : '#22c55e' }}>
                  {p.stock_quantity} {p.unit}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ajuste */}
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">2. Tipo e quantidade</h3>

          {selected && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.15)' }}>
              <p className="font-bold text-gray-800 text-sm">{selected.name}</p>
              <p className="text-xs text-gray-500">Estoque atual: <strong>{selected.stock_quantity} {selected.unit}</strong> · {formatCurrency(selected.sale_price)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'in', label: 'Entrada', icon: ArrowUpCircle, color: '#22c55e' },
              { value: 'out', label: 'Saída', icon: ArrowDownCircle, color: '#ef4444' },
            ].map(t => {
              const Icon = t.icon
              return (
                <button key={t.value} onClick={() => setType(t.value as 'in' | 'out')}
                  className="flex items-center gap-2 justify-center py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: type === t.value ? t.color : '#f1f5f9', color: type === t.value ? '#fff' : '#64748b' }}>
                  <Icon size={15} /> {t.label}
                </button>
              )
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quantidade</label>
            <input type="number" className="input-field" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} min={1} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Motivo</label>
            <input className="input-field text-sm" placeholder="Ex: Compra fornecedor, Uso interno..." value={reason} onChange={e => setReason(e.target.value)} />
          </div>

          {selected && qty && Number(qty) > 0 && (
            <div className="p-3 rounded-xl text-sm" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className="text-gray-500">Estoque após ajuste:</p>
              <p className="font-black text-lg" style={{ color: type === 'in' ? '#22c55e' : '#ef4444' }}>
                {Math.max(0, selected.stock_quantity + (type === 'in' ? Number(qty) : -Number(qty)))} {selected.unit}
              </p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading || !selected} className="btn-primary w-full py-3">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Registrando...</> : 'Confirmar Ajuste'}
          </button>
        </div>
      </div>
    </div>
  )
}
