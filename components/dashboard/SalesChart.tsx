'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ChartData {
  month: string
  receita: number
  lucro: number
  despesas: number
}

interface SalesChartProps {
  data: ChartData[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl p-3 text-sm space-y-1.5"
      style={{
        background: '#0f1729',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 180,
      }}
    >
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-medium text-white">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-base">Desempenho Financeiro</h3>
          <p className="text-sm text-gray-500 mt-0.5">Receita, Lucro e Despesas — últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          {[
            { color: '#0ea5e9', label: 'Receita' },
            { color: '#22c55e', label: 'Lucro' },
            { color: '#f87171', label: 'Despesas' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: 'rgba(0,0,0,0.06)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="receita" name="Receita"
            stroke="#0ea5e9" strokeWidth={2.5}
            fill="url(#colorReceita)" dot={false} activeDot={{ r: 5, fill: '#0ea5e9' }}
          />
          <Area
            type="monotone" dataKey="lucro" name="Lucro"
            stroke="#22c55e" strokeWidth={2}
            fill="url(#colorLucro)" dot={false} activeDot={{ r: 5, fill: '#22c55e' }}
          />
          <Area
            type="monotone" dataKey="despesas" name="Despesas"
            stroke="#f87171" strokeWidth={1.5}
            fill="none" dot={false} activeDot={{ r: 4, fill: '#f87171' }}
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
