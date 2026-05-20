import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { Package, Search, AlertTriangle, Plus, ArrowUpDown, Pencil } from 'lucide-react'
import Link from 'next/link'

export default async function EstoquePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rawProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('name')

  const products = rawProducts as import('@/lib/supabase/types').Product[] | null

  const lowStock = (products ?? []).filter(p => p.stock_quantity <= p.min_stock && p.min_stock > 0)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package size={24} className="text-sky-500" />
            Estoque
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{products?.length ?? 0} materiais cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Link href="/estoque/ajuste" className="btn-ghost flex items-center gap-1.5 text-sm">
            <ArrowUpDown size={14} /> Ajustar
          </Link>
          <Link href="/estoque/novo" className="btn-primary">
            <Plus size={15} /> Novo Produto
          </Link>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm font-medium text-amber-700">
            <strong>{lowStock.length} produto(s)</strong> com estoque abaixo do mínimo
          </p>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-8 text-xs" placeholder="Buscar produto..." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Código', 'Material', 'Setor', 'Unidade', 'Custo', 'Preço de Venda', 'Estoque', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((p) => (
                <tr key={p.id} className="table-row-hover group" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="px-4 py-2.5 font-mono text-xs font-bold text-sky-600">{p.code}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800 max-w-xs">
                    <span className="truncate block">{p.name}</span>
                    {p.notes && <span className="text-xs text-gray-400 truncate block">{p.notes}</span>}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{p.sector}</td>
                  <td className="px-4 py-2.5 text-gray-500">{p.unit}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-sm">{formatCurrency(p.cost)}</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-900">{formatCurrency(p.sale_price)}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-sm"
                      style={{ color: p.stock_quantity <= p.min_stock && p.min_stock > 0 ? '#f59e0b' : '#22c55e' }}>
                      {p.stock_quantity} {p.unit}
                    </span>
                    {p.min_stock > 0 && <span className="text-xs text-gray-400 block">mín: {p.min_stock}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link href={`/estoque/${p.id}/editar`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-sky-500 hover:text-sky-700 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg hover:bg-sky-50">
                      <Pencil size={12} /> Editar
                    </Link>
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
