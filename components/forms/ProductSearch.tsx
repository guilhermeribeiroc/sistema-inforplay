'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Trash2, ChevronDown, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/lib/supabase/types'

export interface CartItem {
  product: Product
  quantity: number
  unit_price: number
}

interface Props {
  cart: CartItem[]
  onChange: (cart: CartItem[]) => void
}

export default function ProductSearch({ cart, onChange }: Props) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).order('name')
      .then(({ data }) => setAllProducts((data as Product[]) ?? []))
  }, [])

  const filtered = query.trim().length === 0
    ? allProducts
    : allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.code.toLowerCase().includes(query.toLowerCase())
      )

  function addToCart(p: Product) {
    const exists = cart.find(i => i.product.id === p.id)
    if (exists) {
      onChange(cart.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      onChange([...cart, { product: p, quantity: 1, unit_price: p.sale_price }])
    }
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) { onChange(cart.filter(i => i.product.id !== id)); return }
    onChange(cart.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
  }

  function updatePrice(id: string, price: number) {
    onChange(cart.map(i => i.product.id === id ? { ...i, unit_price: price } : i))
  }

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  return (
    <div className="space-y-3">
      {/* Campo de busca */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          className="input-field pl-9 pr-9"
          placeholder={allProducts.length === 0 ? 'Carregando produtos...' : `Buscar em ${allProducts.length} produtos...`}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          style={{
            transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
            transition: 'transform 0.15s',
          }}
        />

        {open && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ maxHeight: 320 }}
          >
            <div className="px-3 py-2 border-b border-gray-50 shrink-0 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {query ? `${filtered.length} resultado(s)` : `Todos os produtos (${allProducts.length})`}
              </p>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.map((p, idx) => (
                <button
                  key={p.id}
                  onMouseDown={() => addToCart(p)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-sky-50 text-left transition-colors"
                  style={{ borderTop: idx > 0 ? '1px solid #f8fafc' : 'none' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                    <span className="font-mono text-xs font-bold text-sky-600 shrink-0 w-16 truncate">{p.code}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.unit} · estoque: {p.stock_quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">{formatCurrency(p.sale_price)}</p>
                </button>
              ))}
              {filtered.length === 0 && query && (
                <div className="p-5 text-sm text-gray-400 text-center">
                  Nenhum produto para "<strong>{query}</strong>"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabela do carrinho */}
      {cart.length > 0 ? (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: '1fr 80px 90px 80px 32px' }}>
            <span>Produto</span>
            <span className="text-center">Qtd</span>
            <span className="text-center">Unit. R$</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          {cart.map(item => (
            <div
              key={item.product.id}
              className="grid px-4 py-2.5 items-center border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
              style={{ gridTemplateColumns: '1fr 80px 90px 80px 32px' }}
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400">{item.product.code} · {item.product.unit}</p>
              </div>

              <input
                type="number"
                value={item.quantity}
                onChange={e => updateQty(item.product.id, Number(e.target.value))}
                className="w-full text-center rounded-lg border border-gray-200 px-1 py-1.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100"
                min={1}
              />

              <input
                type="number"
                value={item.unit_price}
                onChange={e => updatePrice(item.product.id, Number(e.target.value))}
                className="w-full text-center rounded-lg border border-gray-200 px-1 py-1.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100"
                min={0}
                step={0.01}
              />

              <p className="text-sm font-bold text-gray-900 text-right">
                {formatCurrency(item.quantity * item.unit_price)}
              </p>

              <button
                onClick={() => onChange(cart.filter(i => i.product.id !== item.product.id))}
                className="flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors rounded-lg p-1 hover:bg-red-50 ml-auto"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-gray-200 text-gray-300">
          <Package size={28} className="mb-2 opacity-50" />
          <p className="text-sm">Clique no campo acima para buscar e adicionar produtos</p>
        </div>
      )}
    </div>
  )
}
