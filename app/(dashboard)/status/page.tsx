import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getStatusLabel, getPriorityLabel, formatCurrency, formatDate } from '@/lib/utils'
import type { ServiceOrder } from '@/lib/supabase/types'
import { Kanban } from 'lucide-react'

const columns = [
  { key: 'open',               label: 'Aberta',             color: '#3b82f6', bg: '#eff6ff' },
  { key: 'in_progress',        label: 'Em Andamento',       color: '#a16207', bg: '#fef9c3' },
  { key: 'waiting_third_party',label: 'Aguardando Terceiro',color: '#c2410c', bg: '#fff7ed' },
  { key: 'ready',              label: 'Pronta',             color: '#15803d', bg: '#f0fdf4' },
  { key: 'delivered',          label: 'Entregue',           color: '#475569', bg: '#f1f5f9' },
]

const priorityColors: Record<string, string> = {
  urgent: '#ef4444', high: '#f59e0b', normal: '#0ea5e9', low: '#94a3b8',
}

export default async function StatusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rawOrders } = await supabase
    .from('service_orders')
    .select('*')
    .not('status', 'eq', 'cancelled')
    .order('created_at', { ascending: false })

  const orders = (rawOrders as ServiceOrder[] | null) ?? []

  const grouped = orders.reduce<Record<string, ServiceOrder[]>>((acc, os) => {
    if (!acc[os.status]) acc[os.status] = []
    acc[os.status].push(os)
    return acc
  }, {})

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Kanban size={24} className="text-sky-500" />
          Painel de Status
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Acompanhe todas as ordens de serviço em tempo real</p>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colOrders = grouped[col.key] ?? []
          return (
            <div key={col.key} className="shrink-0 w-72">
              {/* Column header */}
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-3"
                style={{ background: col.bg, border: `1px solid ${col.color}22` }}
              >
                <span className="text-sm font-bold" style={{ color: col.color }}>{col.label}</span>
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: col.color, color: '#fff' }}
                >
                  {colOrders.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2.5">
                {colOrders.map((os) => (
                  <div key={os.id} className="card p-4 cursor-pointer hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{os.title}</p>
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ background: priorityColors[os.priority] }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {os.customer_name} · OS #{os.os_number}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">{formatCurrency(os.total)}</span>
                      <span className="text-xs text-gray-400">{formatDate(os.created_at)}</span>
                    </div>
                    {os.employee_name && (
                      <p className="text-xs text-gray-400 mt-1.5 pt-1.5" style={{ borderTop: '1px solid #f1f5f9' }}>
                        👤 {os.employee_name}
                      </p>
                    )}
                  </div>
                ))}
                {colOrders.length === 0 && (
                  <div
                    className="rounded-xl p-4 text-center text-xs text-gray-300"
                    style={{ border: '2px dashed #e2e8f0' }}
                  >
                    Nenhuma ordem
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
