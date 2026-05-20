import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

export default async function RelatoriosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
  if (me?.role !== 'admin') redirect('/')

  const { data: salesData } = await supabase
    .from('sales').select('sale_date,total,status,employee_name,payment_method')
    .eq('status', 'completed').order('sale_date', { ascending: false })
  const sales = (salesData as any[]) ?? []

  const thisMonth = new Date().toISOString().slice(0, 7)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  const thisMonthSales = sales.filter(s => s.sale_date?.startsWith(thisMonth))
  const lastMonthSales = sales.filter(s => s.sale_date?.startsWith(lastMonth))
  const thisTotal = thisMonthSales.reduce((s, v) => s + v.total, 0)
  const lastTotal = lastMonthSales.reduce((s, v) => s + v.total, 0)
  const growth = lastTotal > 0 ? ((thisTotal - lastTotal) / lastTotal * 100).toFixed(1) : '—'

  const byPayment = sales.reduce<Record<string, number>>((acc, s) => {
    acc[s.payment_method] = (acc[s.payment_method] ?? 0) + s.total; return acc
  }, {})

  const payLabels: Record<string, string> = { pix: 'PIX', cash: 'Dinheiro', credit_card: 'Crédito', debit_card: 'Débito', transfer: 'Transferência' }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <TrendingUp size={22} className="text-sky-500" /> Relatórios
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Análise financeira da empresa</p>
      </div>

      {/* KPIs comparativos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Mês Atual', value: formatCurrency(thisTotal), sub: `${thisMonthSales.length} vendas`, color: '#0ea5e9' },
          { label: 'Receita Mês Anterior', value: formatCurrency(lastTotal), sub: `${lastMonthSales.length} vendas`, color: '#6366f1' },
          { label: 'Crescimento', value: growth === '—' ? '—' : `${growth}%`, sub: 'vs mês anterior', color: Number(growth) >= 0 ? '#22c55e' : '#ef4444' },
          { label: 'Total Histórico', value: formatCurrency(sales.reduce((s,v) => s + v.total, 0)), sub: `${sales.length} vendas`, color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Por forma de pagamento */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-4">Por Forma de Pagamento</h3>
          <div className="space-y-3">
            {Object.entries(byPayment).sort((a,b) => b[1]-a[1]).map(([method, total]) => {
              const pct = sales.reduce((s,v) => s+v.total, 0) > 0 ? (total / sales.reduce((s,v) => s+v.total, 0) * 100) : 0
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{payLabels[method] ?? method}</span>
                    <span className="font-bold">{formatCurrency(total)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{pct.toFixed(1)}%</p>
                </div>
              )
            })}
            {Object.keys(byPayment).length === 0 && <p className="text-gray-300 text-sm">Sem dados</p>}
          </div>
        </div>

        {/* Últimas vendas */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-4">Últimas Vendas</h3>
          <div className="space-y-2">
            {sales.slice(0, 8).map((s, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.employee_name ?? 'Funcionário'}</p>
                  <p className="text-xs text-gray-400">{s.sale_date} · {payLabels[s.payment_method] ?? s.payment_method}</p>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(s.total)}</span>
              </div>
            ))}
            {sales.length === 0 && <p className="text-gray-300 text-sm">Sem vendas registradas</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
