import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users2, Plus, ShoppingCart, FileText, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import type { Customer } from '@/lib/supabase/types'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('name')
  const customers = (data as Customer[] | null) ?? []

  // Busca contagens por cliente
  const { data: salesData } = await supabase
    .from('sales')
    .select('customer_name, total')
    .eq('status', 'completed')

  const { data: quotesData } = await supabase
    .from('quotes')
    .select('customer_name')

  const { data: osData } = await supabase
    .from('service_orders')
    .select('customer_name')

  const salesByName: Record<string, { count: number; total: number }> = {}
  for (const s of salesData ?? []) {
    const k = s.customer_name?.toLowerCase() ?? ''
    if (!salesByName[k]) salesByName[k] = { count: 0, total: 0 }
    salesByName[k].count++
    salesByName[k].total += Number(s.total)
  }

  const quotesByName: Record<string, number> = {}
  for (const q of quotesData ?? []) {
    const k = q.customer_name?.toLowerCase() ?? ''
    quotesByName[k] = (quotesByName[k] ?? 0) + 1
  }

  const osByName: Record<string, number> = {}
  for (const o of osData ?? []) {
    const k = o.customer_name?.toLowerCase() ?? ''
    osByName[k] = (osByName[k] ?? 0) + 1
  }

  const totalRevenue = customers.reduce((s, c) => {
    return s + (salesByName[c.name.toLowerCase()]?.total ?? 0)
  }, 0)

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users2 size={22} className="text-sky-500" /> Clientes
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{customers.length} clientes cadastrados</p>
        </div>
        <Link href="/clientes/novo" className="btn-primary">
          <Plus size={15} /> Novo Cliente
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Clientes', value: customers.length, color: '#0ea5e9' },
          { label: 'Receita Total', value: formatCurrency(totalRevenue), color: '#22c55e' },
          { label: 'Ticket Médio', value: formatCurrency(customers.length > 0 ? totalRevenue / Math.max(1, (salesData ?? []).filter(s => s.customer_name !== 'Cliente Avulso').length) : 0), color: '#6366f1' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => {
          const sales = salesByName[c.name.toLowerCase()] ?? { count: 0, total: 0 }
          const quotes = quotesByName[c.name.toLowerCase()] ?? 0
          const os = osByName[c.name.toLowerCase()] ?? 0
          return (
            <div key={c.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
                  {c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  {c.phone && <p className="text-xs text-gray-400 mt-0.5">📞 {c.phone}</p>}
                  {c.email && <p className="text-xs text-gray-400 truncate">✉ {c.email}</p>}
                </div>
              </div>

              {(c.city || c.state) && (
                <p className="text-xs text-gray-400 mb-3">📍 {[c.city, c.state].filter(Boolean).join(', ')}</p>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl p-2" style={{ background: 'rgba(14,165,233,0.06)' }}>
                  <ShoppingCart size={12} className="mx-auto mb-0.5 text-sky-500" />
                  <p className="text-xs font-bold text-gray-800">{sales.count}</p>
                  <p className="text-xs text-gray-400">Vendas</p>
                </div>
                <div className="rounded-xl p-2" style={{ background: 'rgba(99,102,241,0.06)' }}>
                  <FileText size={12} className="mx-auto mb-0.5 text-violet-500" />
                  <p className="text-xs font-bold text-gray-800">{quotes}</p>
                  <p className="text-xs text-gray-400">Orç.</p>
                </div>
                <div className="rounded-xl p-2" style={{ background: 'rgba(245,158,11,0.06)' }}>
                  <ClipboardList size={12} className="mx-auto mb-0.5 text-amber-500" />
                  <p className="text-xs font-bold text-gray-800">{os}</p>
                  <p className="text-xs text-gray-400">OS</p>
                </div>
              </div>

              {sales.total > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total gasto</span>
                  <span className="text-sm font-black text-sky-600">{formatCurrency(sales.total)}</span>
                </div>
              )}

              {c.notes && (
                <p className="mt-2 text-xs text-gray-400 italic truncate">{c.notes}</p>
              )}
            </div>
          )
        })}

        {customers.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-300">
            <Users2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum cliente cadastrado</p>
            <p className="text-sm mt-1">Clientes são cadastrados automaticamente ao criar vendas, orçamentos ou OS.</p>
          </div>
        )}
      </div>
    </div>
  )
}
