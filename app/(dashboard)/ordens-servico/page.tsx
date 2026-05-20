import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, getStatusLabel, getPriorityLabel } from '@/lib/utils'
import { ClipboardList, Plus } from 'lucide-react'
import Link from 'next/link'
import type { ServiceOrder } from '@/lib/supabase/types'

const statusStyle: Record<string, string> = {
  open: 'badge-open', in_progress: 'badge-progress',
  waiting_third_party: 'badge-waiting', ready: 'badge-ready',
  delivered: 'badge-delivered', cancelled: 'badge-cancelled',
}
const priorityColor: Record<string, string> = {
  urgent: '#ef4444', high: '#f59e0b', normal: '#0ea5e9', low: '#94a3b8',
}

export default async function OrdensServicoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
  const isAdmin = profile?.role === 'admin'

  let query = supabase.from('service_orders').select('*').order('created_at', { ascending: false })
  if (!isAdmin) query = query.eq('employee_id', user.id)

  const { data } = await query
  const orders = (data as ServiceOrder[] | null) ?? []

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardList size={22} className="text-sky-500" /> Ordens de Serviço
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} ordens encontradas</p>
        </div>
        <Link href="/ordens-servico/nova" className="btn-primary">
          <Plus size={15} /> Nova OS
        </Link>
      </div>

      {/* Cards resumo por status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'open',        label: 'Abertas',     color: '#3b82f6' },
          { key: 'in_progress', label: 'Andamento',   color: '#a16207' },
          { key: 'ready',       label: 'Prontas',     color: '#15803d' },
          { key: 'delivered',   label: 'Entregues',   color: '#475569' },
        ].map(s => (
          <div key={s.key} className="card p-3 flex items-center gap-3">
            <div className="w-2 h-8 rounded-full shrink-0" style={{ background: s.color }} />
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>
                {orders.filter(o => o.status === s.key).length}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['#', 'Título', 'Cliente', 'Funcionário', 'Valor', 'Criada em', 'Status', 'Prior.'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-300">Nenhuma ordem encontrada</td></tr>
              )}
              {orders.map(os => (
                <tr key={os.id} className="table-row-hover cursor-pointer" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="px-4 py-3 font-mono font-bold text-sky-600 text-xs">#{os.os_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{os.title}</td>
                  <td className="px-4 py-3 text-gray-600">{os.customer_name}</td>
                  <td className="px-4 py-3 text-gray-500">{os.employee_name ?? '—'}</td>
                  <td className="px-4 py-3 font-bold">{formatCurrency(os.total)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(os.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle[os.status] ?? ''}`}>
                      {getStatusLabel(os.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold" style={{ color: priorityColor[os.priority] }}>
                      {getPriorityLabel(os.priority)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
