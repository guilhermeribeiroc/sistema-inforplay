import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { FileText, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import type { Quote } from '@/lib/supabase/types'

const statusStyle: Record<string, string> = {
  pending:   'badge-open',
  approved:  'badge-ready',
  rejected:  'badge-cancelled',
  expired:   'badge-delivered',
  converted: 'badge-progress',
}

export default async function OrcamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
  const isAdmin = profile?.role === 'admin'

  let query = supabase.from('quotes').select('*').order('created_at', { ascending: false })
  if (!isAdmin) query = query.eq('employee_id', user.id)

  const { data: quotes } = await query
  const list = (quotes as Quote[] | null) ?? []

  const counts = {
    total: list.length,
    pending: list.filter(q => q.status === 'pending').length,
    approved: list.filter(q => q.status === 'approved').length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileText size={22} className="text-sky-500" /> Orçamentos
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{counts.total} orçamentos no total</p>
        </div>
        <Link href="/orcamentos/novo" className="btn-primary">
          <Plus size={15} /> Novo Orçamento
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendentes',  value: counts.pending,  icon: <Clock size={16} className="text-sky-500" />,      bg: 'rgba(14,165,233,0.07)' },
          { label: 'Aprovados',  value: counts.approved, icon: <CheckCircle2 size={16} className="text-emerald-500" />, bg: 'rgba(34,197,94,0.07)' },
          { label: 'Total',      value: counts.total,    icon: <FileText size={16} className="text-violet-500" />, bg: 'rgba(139,92,246,0.07)' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['#', 'Cliente', 'Funcionário', 'Total', 'Válido até', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-300">Nenhum orçamento encontrado</td></tr>
              )}
              {list.map(q => (
                <tr key={q.id} className="table-row-hover" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="px-5 py-3 font-mono font-bold text-sky-600 text-xs">#{q.quote_number}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{q.customer_name}</td>
                  <td className="px-5 py-3 text-gray-500">{q.employee_name ?? '—'}</td>
                  <td className="px-5 py-3 font-bold text-gray-900">{formatCurrency(q.total)}</td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(q.valid_until)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle[q.status] ?? ''}`}>
                      {getStatusLabel(q.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-sky-500 hover:underline font-medium">Ver</button>
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
