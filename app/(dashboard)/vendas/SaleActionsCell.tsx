'use client'

import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function SaleActionsCell({ saleId, saleNumber }: { saleId: string; saleNumber: number }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Excluir venda #${saleNumber}? Esta ação não pode ser desfeita.`)) return
    const supabase = createClient()
    await supabase.from('sale_items').delete().eq('sale_id', saleId)
    const { error } = await supabase.from('sales').delete().eq('id', saleId)
    if (error) { toast.error('Erro ao excluir: ' + error.message); return }
    toast.success(`Venda #${saleNumber} excluída.`)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/vendas/${saleId}/editar`}
        className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 transition-colors"
        title="Editar"
      >
        <Pencil size={13} />
      </Link>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
        title="Excluir"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
