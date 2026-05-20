import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { Wrench, Star, Crown, Plus } from 'lucide-react'
import Link from 'next/link'
import type { ThirdParty } from '@/lib/supabase/types'

export default async function TerceirizadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single() as any
  if (me?.role !== 'admin') redirect('/')

  const { data } = await supabase.from('third_parties').select('*').order('total_orders', { ascending: false })
  const list = (data as ThirdParty[] | null) ?? []
  const top = list[0]

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Wrench size={22} className="text-sky-500" /> Terceirizados
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{list.filter(t => t.active).length} ativos · {list.length} total</p>
        </div>
        <Link href="/terceirizados/novo" className="btn-primary">
          <Plus size={15} /> Novo Terceirizado
        </Link>
      </div>

      {top && (
        <div className="relative rounded-2xl p-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f1729,#1e2d4a)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>👑</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Melhor Terceirizado</p>
              <p className="text-lg font-black text-white">{top.name}</p>
              <p className="text-sm text-gray-400">{top.service} · {top.total_orders} pedidos · {formatCurrency(top.total_paid)} pago</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((tp, i) => (
          <div key={tp.id} className={`card p-5 ${i === 0 ? 'ring-2 ring-amber-200' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">{tp.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tp.service ?? 'Serviço geral'}</p>
              </div>
              {i === 0 && <Crown size={16} className="text-amber-500 shrink-0" />}
            </div>
            <div className="space-y-1.5 text-xs">
              {tp.phone && <p className="text-gray-500">📞 {tp.phone}</p>}
              <div className="flex justify-between"><span className="text-gray-400">Total pedidos</span><span className="font-bold">{tp.total_orders}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Total pago</span><span className="font-bold text-sky-600">{formatCurrency(tp.total_paid)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Prazo médio</span><span className="font-bold">{tp.delivery_avg_days}d</span></div>
              <div className="flex items-center gap-1 pt-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= Math.round(tp.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />)}
                <span className="text-gray-400 ml-1">{tp.rating}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tp.active ? 'badge-ready' : 'badge-cancelled'}`}>
                {tp.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-300">
            <Wrench size={40} className="mx-auto mb-2 opacity-30" />
            <p>Nenhum terceirizado cadastrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
