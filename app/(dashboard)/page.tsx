import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import StatCard from '@/components/dashboard/StatCard'
import SalesChart from '@/components/dashboard/SalesChart'
import SellerRankingCard from '@/components/dashboard/SellerRankingCard'
import RecentOrdersCard from '@/components/dashboard/RecentOrdersCard'
import {
  DollarSign, TrendingUp, ShoppingBag, Clock,
  CheckCircle2, FileText, Users, Zap, Plus, Eye,
} from 'lucide-react'
import type { DashboardSummary, SellerRanking, ServiceOrder } from '@/lib/supabase/types'
import Link from 'next/link'

// Mock monthly chart data (replace with real DB query)
function buildChartData(monthlySales: any[]) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  return months.map((month, i) => ({
    month,
    receita:  Math.random() * 15000 + 5000,
    lucro:    Math.random() * 6000 + 2000,
    despesas: Math.random() * 4000 + 1000,
  }))
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: { role: string; name: string } | null }

  if (!profile || profile.role !== 'admin') {
    redirect('/status')
  }

  // Fetch dashboard data in parallel
  const [summaryRes, rankingRes, ordersRes, monthlySalesRes] = await Promise.all([
    supabase.from('v_dashboard_summary').select('*').single(),
    supabase.from('v_seller_ranking_current_month').select('*').order('ranking'),
    supabase
      .from('service_orders')
      .select('*')
      .not('status', 'in', '("delivered","cancelled")')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('sales')
      .select('sale_date, total')
      .eq('status', 'completed')
      .order('sale_date', { ascending: true }),
  ])

  const summary: DashboardSummary = (summaryRes.data as DashboardSummary | null) ?? {
    today_revenue: 0, month_revenue: 0, month_sales_count: 0,
    pending_orders: 0, ready_orders: 0, pending_quotes: 0, active_employees: 0,
  }
  const sellers: SellerRanking[] = (rankingRes.data as SellerRanking[] | null) ?? []
  const orders: ServiceOrder[] = (ordersRes.data as ServiceOrder[] | null) ?? []
  const chartData = buildChartData(monthlySalesRes.data ?? [])

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Bom dia' : today.getHours() < 18 ? 'Boa tarde' : 'Boa noite'
  const topSeller = sellers[0]

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-screen-2xl">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-400">
            {greeting}, <span className="text-sky-500 font-semibold">{profile.name.split(' ')[0]}</span> 👋
          </p>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/vendas/nova"
            className="btn-primary"
          >
            <Plus size={15} strokeWidth={2.5} />
            Nova Venda
          </Link>
          <Link href="/ordens-servico/nova" className="btn-ghost">
            <Plus size={15} />
            Nova OS
          </Link>
        </div>
      </div>

      {/* ── Best seller banner ──────────────────────── */}
      {topSeller && (
        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f1729 0%, #1e2d4a 100%)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)',
            }}
          />
          <div className="relative flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              👑
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-0.5">
                Melhor Vendedor do Mês
              </p>
              <p className="text-lg font-black text-white">{topSeller.employee_name}</p>
              <p className="text-sm text-gray-400">
                {formatCurrency(topSeller.total_revenue)} em {topSeller.total_sales} vendas
              </p>
            </div>
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <Zap size={16} className="text-amber-400" />
              <span className="text-sm font-bold text-amber-400">#{topSeller.ranking}º</span>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Receita Hoje"
          value={formatCurrency(summary.today_revenue)}
          icon={<DollarSign size={20} className="text-sky-500" />}
          iconBg="rgba(14,165,233,0.1)"
          glowClass="stat-card-glow-blue"
          change={12.5}
          changeLabel="vs ontem"
        />
        <StatCard
          title="Receita do Mês"
          value={formatCurrency(summary.month_revenue)}
          icon={<TrendingUp size={20} className="text-emerald-500" />}
          iconBg="rgba(34,197,94,0.1)"
          glowClass="stat-card-glow-green"
          change={8.2}
          changeLabel="vs mês anterior"
        />
        <StatCard
          title="Vendas no Mês"
          value={String(summary.month_sales_count)}
          suffix="pedidos"
          icon={<ShoppingBag size={20} className="text-violet-500" />}
          iconBg="rgba(139,92,246,0.1)"
          glowClass="stat-card-glow-violet"
          change={-3.1}
          changeLabel="vs mês anterior"
        />
        <StatCard
          title="OS Pendentes"
          value={String(summary.pending_orders)}
          suffix="abertas"
          icon={<Clock size={20} className="text-amber-500" />}
          iconBg="rgba(245,158,11,0.1)"
          glowClass="stat-card-glow-amber"
        />
      </div>

      {/* ── Secondary KPIs ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'OS Prontas',
            value: summary.ready_orders,
            icon: <CheckCircle2 size={16} className="text-emerald-500" />,
            color: 'text-emerald-600',
            bg: 'rgba(34,197,94,0.07)',
            href: '/status',
          },
          {
            label: 'Orçamentos Pendentes',
            value: summary.pending_quotes,
            icon: <FileText size={16} className="text-blue-500" />,
            color: 'text-blue-600',
            bg: 'rgba(59,130,246,0.07)',
            href: '/orcamentos',
          },
          {
            label: 'Funcionários Ativos',
            value: summary.active_employees,
            icon: <Users size={16} className="text-purple-500" />,
            color: 'text-purple-600',
            bg: 'rgba(139,92,246,0.07)',
            href: '/funcionarios',
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="card p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Chart + Ranking ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SalesChart data={chartData} />
        </div>
        <div>
          <SellerRankingCard sellers={sellers} />
        </div>
      </div>

      {/* ── Recent Orders ──────────────────────────── */}
      <RecentOrdersCard orders={orders} />

    </div>
  )
}
