import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { Users, Crown, TrendingUp } from 'lucide-react'
import type { Profile, SellerRanking } from '@/lib/supabase/types'

export default async function FuncionariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
  if (me?.role !== 'admin') redirect('/')

  const { data: profiles } = await supabase.from('profiles').select('*').order('name') as { data: Profile[] | null }
  const { data: ranking } = await supabase.from('v_seller_ranking_current_month').select('*') as { data: SellerRanking[] | null }

  const employees = (profiles ?? []).filter(p => p.role === 'employee')
  const rankMap = Object.fromEntries((ranking ?? []).map(r => [r.employee_id, r]))

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Users size={22} className="text-sky-500" /> Funcionários
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">{employees.filter(e => e.active).length} ativos · {employees.length} total</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp, i) => {
          const rank = rankMap[emp.id]
          const isTop = rank?.ranking === 1
          return (
            <div key={emp.id} className={`card p-5 ${isTop ? 'ring-2 ring-amber-300' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
                    {emp.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.email}</p>
                  </div>
                </div>
                {isTop && <Crown size={18} className="text-amber-500 shrink-0" />}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Vendas este mês</span>
                  <span className="font-bold text-gray-700">{rank?.total_sales ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Receita</span>
                  <span className="font-bold text-sky-600">{formatCurrency(rank?.total_revenue ?? 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Ranking</span>
                  <span className="font-bold" style={{ color: isTop ? '#f59e0b' : '#64748b' }}>
                    {rank ? `#${rank.ranking}º` : '—'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${emp.active ? 'badge-ready' : 'badge-cancelled'}`}>
                  {emp.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          )
        })}
        {employees.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-300">
            <Users size={40} className="mx-auto mb-2 opacity-30" />
            <p>Nenhum funcionário cadastrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
