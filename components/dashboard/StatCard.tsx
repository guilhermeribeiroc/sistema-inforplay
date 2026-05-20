'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconBg: string
  glowClass?: string
  suffix?: string
}

export default function StatCard({
  title, value, change, changeLabel, icon, iconBg, glowClass, suffix,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <div
      className={`card p-5 transition-all duration-200 hover:-translate-y-0.5 ${glowClass ?? ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1 leading-none">
            {value}
            {suffix && <span className="text-base font-semibold text-gray-400 ml-1">{suffix}</span>}
          </p>

          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp size={13} className="text-emerald-500" />}
              {isNegative && <TrendingDown size={13} className="text-red-400" />}
              {change === 0 && <Minus size={13} className="text-gray-400" />}
              <span
                className="text-xs font-semibold"
                style={{ color: isPositive ? '#22c55e' : isNegative ? '#f87171' : '#94a3b8' }}
              >
                {isPositive ? '+' : ''}{change?.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
