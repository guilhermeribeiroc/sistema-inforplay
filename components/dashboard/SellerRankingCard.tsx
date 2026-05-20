'use client'

import { Crown, Medal, Award, TrendingUp } from 'lucide-react'
import { formatCurrency, initials } from '@/lib/utils'
import type { SellerRanking } from '@/lib/supabase/types'

interface SellerRankingCardProps {
  sellers: SellerRanking[]
}

const rankingConfig = [
  { icon: Crown,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: '1º' },
  { icon: Medal,  color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', label: '2º' },
  { icon: Award,  color: '#cd7c2e', bg: 'rgba(205,124,46,0.1)', border: 'rgba(205,124,46,0.2)', label: '3º' },
]

export default function SellerRankingCard({ sellers }: SellerRankingCardProps) {
  const top = sellers.slice(0, 3)
  const rest = sellers.slice(3)

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Crown size={18} className="text-amber-500" />
            Ranking de Vendedores
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Mês atual</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}
        >
          {sellers.length} vendedores
        </span>
      </div>

      {/* Top 3 podium */}
      <div className="space-y-2.5 mb-4">
        {top.map((seller, i) => {
          const cfg = rankingConfig[i]
          const Icon = cfg.icon
          const barWidth = sellers[0]?.total_revenue
            ? (seller.total_revenue / sellers[0].total_revenue) * 100
            : 0

          return (
            <div
              key={seller.employee_id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: i === 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))' : '#fafafa',
                border: `1px solid ${cfg.border}`,
              }}
            >
              {/* Rank badge */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
              >
                <Icon size={15} style={{ color: cfg.color }} />
              </div>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, #0ea5e9, #6366f1)` }}
              >
                {initials(seller.employee_name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{seller.employee_name}</p>
                  <p className="text-sm font-bold ml-2 shrink-0" style={{ color: cfg.color }}>
                    {formatCurrency(seller.total_revenue)}
                  </p>
                </div>
                {/* Bar */}
                <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barWidth}%`, background: cfg.color }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{seller.total_sales} vendas</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rest */}
      {rest.length > 0 && (
        <div className="space-y-1.5 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          {rest.map((seller) => (
            <div key={seller.employee_id} className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-300 w-5">{seller.ranking}º</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}
                >
                  {initials(seller.employee_name)}
                </div>
                <span className="text-sm text-gray-600">{seller.employee_name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">{formatCurrency(seller.total_revenue)}</span>
            </div>
          ))}
        </div>
      )}

      {sellers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <TrendingUp size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nenhuma venda registrada este mês</p>
        </div>
      )}
    </div>
  )
}
