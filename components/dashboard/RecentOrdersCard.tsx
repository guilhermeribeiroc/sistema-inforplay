'use client'

import { ClipboardList, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate, getStatusLabel, getPriorityLabel } from '@/lib/utils'
import type { ServiceOrder } from '@/lib/supabase/types'

const statusStyles: Record<string, string> = {
  open:               'badge-open',
  in_progress:        'badge-progress',
  waiting_third_party:'badge-waiting',
  ready:              'badge-ready',
  delivered:          'badge-delivered',
  cancelled:          'badge-cancelled',
}

const priorityColors: Record<string, string> = {
  urgent: '#ef4444',
  high:   '#f59e0b',
  normal: '#0ea5e9',
  low:    '#94a3b8',
}

interface RecentOrdersCardProps {
  orders: ServiceOrder[]
}

export default function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  const router = useRouter()

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <ClipboardList size={18} className="text-sky-500" />
            Ordens de Serviço Recentes
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Últimas abertas / em andamento</p>
        </div>
        <button
          onClick={() => router.push('/ordens-servico')}
          className="text-xs font-semibold flex items-center gap-1 transition-colors hover:text-sky-500"
          style={{ color: '#0ea5e9' }}
        >
          Ver todas <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <ClipboardList size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Nenhuma ordem encontrada</p>
          </div>
        )}
        {orders.map((os) => (
          <div
            key={os.id}
            onClick={() => router.push(`/ordens-servico/${os.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 table-row-hover"
          >
            {/* Priority dot */}
            <div
              className="w-2 h-2 rounded-full shrink-0 mt-0.5"
              style={{ background: priorityColors[os.priority] }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{os.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {os.customer_name} · OS #{os.os_number}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-gray-800">{formatCurrency(os.total)}</p>
                  <p className="text-xs text-gray-400">{formatDate(os.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[os.status] ?? ''}`}>
                  {getStatusLabel(os.status)}
                </span>
                {os.priority !== 'normal' && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: priorityColors[os.priority] }}
                  >
                    {getPriorityLabel(os.priority)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
