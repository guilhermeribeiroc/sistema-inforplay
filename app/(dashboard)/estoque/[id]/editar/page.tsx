'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Package, Loader2, Save, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/supabase/types'

const units = ['UN', 'M2', 'M', 'HH', 'KG', 'L', 'CX']
const sectors = ['Papelaria', 'Informática', 'Gráfica', 'Serviço', 'Outros']

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sector, setSector] = useState('')
  const [unit, setUnit] = useState('UN')
  const [cost, setCost] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [minStock, setMinStock] = useState('0')
  const [notes, setNotes] = useState('')
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) { toast.error('Produto não encontrado'); router.push('/estoque'); return }
        const p = data as Product
        setProduct(p)
        setCode(p.code)
        setName(p.name)
        setSector(p.sector ?? 'Outros')
        setUnit(p.unit)
        setCost(String(p.cost))
        setSalePrice(String(p.sale_price))
        setMinStock(String(p.min_stock))
        setNotes(p.notes ?? '')
        setActive(p.active)
        setLoading(false)
      })
  }, [id])

  async function handleSave() {
    if (!name.trim()) { toast.error('Informe o nome do produto.'); return }
    if (!salePrice || Number(salePrice) <= 0) { toast.error('Informe o preço de venda.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('products').update({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        sector,
        unit,
        cost: Number(cost) || 0,
        sale_price: Number(salePrice),
        min_stock: Number(minStock) || 0,
        notes: notes || null,
        active,
        updated_at: new Date().toISOString(),
      }).eq('id', id)
      if (error) throw error
      toast.success('Produto atualizado com sucesso!')
      router.push('/estoque')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setSaving(false) }
  }

  async function handleDeactivate() {
    if (!confirm(`Desativar "${name}"? O produto não aparecerá mais nas buscas.`)) return
    const supabase = createClient()
    await supabase.from('products').update({ active: false }).eq('id', id)
    toast.success('Produto desativado.')
    router.push('/estoque')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-sky-500" />
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package size={22} className="text-sky-500" /> Editar Produto
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Código: <span className="font-mono font-bold text-sky-600">{product?.code}</span>
            {' · '}Estoque atual: <strong>{product?.stock_quantity} {product?.unit}</strong>
          </p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Código *</label>
            <input className="input-field font-mono" value={code} onChange={e => setCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unidade *</label>
            <select className="input-field" value={unit} onChange={e => setUnit(e.target.value)}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome *</label>
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Setor</label>
          <select className="input-field" value={sector} onChange={e => setSector(e.target.value)}>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Custo (R$)</label>
            <input type="number" className="input-field" value={cost} onChange={e => setCost(e.target.value)} min={0} step={0.01} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço de Venda (R$) *</label>
            <input type="number" className="input-field" value={salePrice} onChange={e => setSalePrice(e.target.value)} min={0} step={0.01} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Estoque Mínimo</label>
          <input type="number" className="input-field" value={minStock} onChange={e => setMinStock(e.target.value)} min={0} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
          <textarea className="input-field resize-none" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {/* Margem calculada */}
        {cost && salePrice && Number(cost) > 0 && Number(salePrice) > 0 && (
          <div className="p-3 rounded-xl text-sm flex items-center justify-between"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <span className="text-gray-500">Margem de lucro</span>
            <span className="font-bold text-emerald-600">
              {(((Number(salePrice) - Number(cost)) / Number(salePrice)) * 100).toFixed(1)}%
              {' '}(+R$ {(Number(salePrice) - Number(cost)).toFixed(2)})
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : <><Save size={15} /> Salvar Alterações</>}
          </button>
          <button onClick={handleDeactivate} className="btn-ghost px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
