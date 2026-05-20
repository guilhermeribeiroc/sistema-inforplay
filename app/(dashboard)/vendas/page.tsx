import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, getPaymentLabel } from '@/lib/utils'
import { ShoppingCart, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Sale } from '@/lib/supabase/types'
import { SaleActionsCell } from './SaleActionsCell'

const statusStyle: Record<string, string> = {
  completed: 'badge-ready',
  pending: 'badge-open',
  cancelled: 'badge-cancelled',
  refunded: 'badge-waiting',
}
const statusLabel: Record<string, string> = {
  completed: 'Concluída', pending: 'Pendente', cancelled: 'Cancelada', refunded: 'Estornada',
}

export default async function VendasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
  const isAdmin = profile?.role === 'admin'

  let query = supabase.from('sales').select('*').order('created_at', { ascending: false })
  if (!isAdmin) query = query.eq('employee_id', user.id)

  const { data } = await query
  const sales = (data as Sale[] | null) ?? []

  const today = new Date().toISOString().slice(0, 10)
  const todaySales = sales.filter(s => s.sale_date?.startsWith(today))
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)
  const monthTotal = sales
    .filter(s => s.sale_date?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingCart size={22} className="text-sky-500" /> Vendas
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{sales.length} vendas registradas</p>
        </div>
        <Link href="/vendas/nova" className="btn-primary">
          <Plus size={15} /> Nova Venda
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vendas Hoje', value: todaySales.length, sub: formatCurrency(todayTotal), color: '#0ea5e9' },
          { label: 'Receita do Mês', value: formatCurrency(monthTotal), sub: `${sales.filter(s => s.sale_date?.startsWith(new Date().toISOString().slice(0, 7))).length} vendas`, color: '#22c55e' },
          { label: 'Total Histórico', value: sales.length, sub: formatCurrency(sales.reduce((s, v) => s + v.total, 0)), color: '#6366f1' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['#', 'Cliente', 'Funcionário', 'Pagamento', 'Total', 'Data', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-300">Nenhuma venda registrada</td></tr>
              )}
              {sales.map(s => (
                <tr key={s.id} className="table-row-hover" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="px-4 py-3 font-mono font-bold text-sky-600 text-xs">#{s.sale_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.customer_name ?? 'Avulso'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.employee_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{getPaymentLabel(s.payment_method)}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{formatCurrency(s.total)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.sale_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[s.status] ?? ''}`}>
                      {statusLabel[s.status] ?? s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SaleActionsCell saleId={s.id} saleNumber={s.sale_number} />
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
