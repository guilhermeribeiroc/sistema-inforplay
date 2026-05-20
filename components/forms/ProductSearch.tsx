'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Trash2, ChevronDown } from 'lucide-react'
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
    <div>
      {/* Search input */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          className="input-field pl-9 pr-9"
          placeholder={allProducts.length === 0 ? 'Carregando...' : `Buscar produto (${allProducts.length} disponíveis)`}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform"
          style={{ transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}
        />

        {open && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ maxHeight: '320px' }}
          >
            {/* Header */}
            <div className="px-3 pt-2.5 pb-1.5 border-b border-gray-50 shrink-0 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {query ? `${filtered.length} resultado(s)` : `Todos os produtos (${allProducts.length})`}
              </p>
              {query && filtered.length === 0 && (
                <span className="text-xs text-red-400">Nenhum encontrado</span>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {filtered.map((p, idx) => (
                <button
                  key={p.id}
                  onMouseDown={() => addToCart(p)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-sky-50 text-left transition-colors"
                  style={{ borderTop: idx > 0 ? '1px solid #f8fafc' : 'none' }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <span className="font-mono text-xs font-bold text-sky-600 shrink-0 w-14 truncate">{p.code}</span>
                    <span className="text-sm text-gray-800 truncate">{p.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{p.unit}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(p.sale_price)}</p>
                    <p className="text-xs text-gray-400">est: {p.stock_quantity}</p>
                  </div>
                </button>
              ))}

              {filtered.length === 0 && query && (
                <div className="p-4 text-sm text-gray-400 text-center">
                  Nenhum produto encontrado para "<strong>{query}</strong>"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart items */}
      {cart.length > 0 && (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-1 px-3 py-1.5 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-5">Produto</div>
            <div className="col-span-2 text-center">Qtd</div>
            <div className="col-span-2 text-center">Unit. (R$)</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>
          {cart.map(item => (
            <div key={item.product.id} className="grid grid-cols-12 gap-1 px-3 py-2 items-center border-t border-gray-50">
              <div className="col-span-5 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400">{item.product.code} · {item.product.unit}</p>
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => updateQty(item.product.id, Number(e.target.value))}
                  className="w-full text-center rounded-lg border border-gray-200 px-1 py-1 text-sm focus:outline-none focus:border-sky-400"
                  min={1}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={e => updatePrice(item.product.id, Number(e.target.value))}
                  className="w-full text-center rounded-lg border border-gray-200 px-1 py-1 text-sm focus:outline-none focus:border-sky-400"
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-bold text-gray-900">{formatCurrency(item.quantity * item.unit_price)}</span>
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => onChange(cart.filter(i => i.product.id !== item.product.id))}
                  className="text-red-400 hover:text-red-600 p-1 rounded"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length === 0 && (
        <p className="text-center text-gray-300 text-sm py-3">
          Clique no campo acima e selecione os produtos
        </p>
      )}
    </div>
  )
}
