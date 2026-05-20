'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, PackagePlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const units = ['UN', 'M2', 'M', 'HH', 'KG', 'L', 'CX']
const sectors = ['Papelaria', 'Informática', 'Gráfica', 'Serviço', 'Outros']

export default function NovoProdutoPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sector, setSector] = useState('Papelaria')
  const [unit, setUnit] = useState('UN')
  const [cost, setCost] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [stockQty, setStockQty] = useState('0')
  const [minStock, setMinStock] = useState('0')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name.trim()) { toast.error('Informe o nome do produto.'); return }
    if (!code.trim()) { toast.error('Informe o código do produto.'); return }
    if (!salePrice || Number(salePrice) <= 0) { toast.error('Informe o preço de venda.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('products').insert({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        sector,
        unit,
        cost: Number(cost) || 0,
        sale_price: Number(salePrice),
        stock_quantity: Number(stockQty) || 0,
        min_stock: Number(minStock) || 0,
        notes: notes || null,
        active: true,
      })
      if (error) {
        if (error.code === '23505') throw new Error('Já existe um produto com este código.')
        throw error
      }
      toast.success('Produto cadastrado com sucesso!')
      router.push('/estoque')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <PackagePlus size={22} className="text-sky-500" /> Novo Produto
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Cadastrar produto ou serviço no estoque</p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Código *</label>
            <input className="input-field font-mono" placeholder="Ex: PL-001" value={code} onChange={e => setCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unidade *</label>
            <select className="input-field" value={unit} onChange={e => setUnit(e.target.value)}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Produto *</label>
          <input className="input-field" placeholder="Nome completo do produto" value={name} onChange={e => setName(e.target.value)} />
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
            <input type="number" className="input-field" placeholder="0,00" value={cost} onChange={e => setCost(e.target.value)} min={0} step={0.01} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preço de Venda (R$) *</label>
            <input type="number" className="input-field" placeholder="0,00" value={salePrice} onChange={e => setSalePrice(e.target.value)} min={0} step={0.01} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Estoque Inicial</label>
            <input type="number" className="input-field" placeholder="0" value={stockQty} onChange={e => setStockQty(e.target.value)} min={0} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Estoque Mínimo</label>
            <input type="number" className="input-field" placeholder="0" value={minStock} onChange={e => setMinStock(e.target.value)} min={0} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
          <textarea className="input-field resize-none" rows={2} placeholder="Especificações, observações..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : <><PackagePlus size={15} /> Cadastrar Produto</>}
        </button>
      </div>
    </div>
  )
}
