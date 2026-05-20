'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Phone, ChevronDown } from 'lucide-react'
import type { Customer } from '@/lib/supabase/types'

interface Props {
  name: string
  phone: string
  onChangeName: (v: string) => void
  onChangePhone: (v: string) => void
}

export default function CustomerSearch({ name, phone, onChangeName, onChangePhone }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('customers').select('id,name,phone,email').order('name').limit(300)
      .then(({ data }) => setCustomers((data as Customer[]) ?? []))
  }, [])

  const filtered = name.trim().length === 0
    ? customers.slice(0, 10)
    : customers.filter(c =>
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        (c.phone ?? '').includes(name)
      ).slice(0, 10)

  function select(c: Customer) {
    onChangeName(c.name)
    onChangePhone(c.phone ?? '')
    setOpen(false)
    inputRef.current?.blur()
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

  const isNew = name.trim().length > 0 &&
    !customers.some(c => c.name.toLowerCase() === name.trim().toLowerCase())

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Nome */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Cliente
          {isNew && <span className="ml-2 normal-case font-semibold text-emerald-600">· novo</span>}
        </label>
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            className="input-field pl-8 pr-8"
            placeholder="Nome do cliente..."
            value={name}
            onChange={e => { onChangeName(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
          />
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            style={{ transform: open ? 'translateY(-50%) rotate(180deg)' : undefined, transition: 'transform 0.15s' }}
          />
        </div>

        {open && filtered.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <p className="text-xs text-gray-400 px-3 pt-2 pb-1 font-semibold uppercase tracking-wider">
              Clientes cadastrados
            </p>
            <div className="max-h-52 overflow-y-auto">
              {filtered.map(c => (
                <button
                  key={c.id}
                  onMouseDown={() => select(c)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-sky-50 text-left border-t border-gray-50 first:border-0 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-600 shrink-0">
                    {c.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                    {c.phone && <p className="text-xs text-gray-400">{c.phone}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Telefone */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="input-field pl-8"
            placeholder="(88) 9 0000-0000"
            value={phone}
            onChange={e => onChangePhone(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
