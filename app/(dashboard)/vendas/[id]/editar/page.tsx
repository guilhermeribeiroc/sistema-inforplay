'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ShoppingCart, Loader2, Save, Trash2 } from 'lucide-react'
import { formatCurrency, getPaymentLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

const paymentMethods = [
  { value: 'pix',         label: 'PIX' },
  { value: 'cash',        label: 'Dinheiro' },
  { value: 'credit_card', label: 'Crédito' },
  { value: 'debit_card',  label: 'Débito' },
  { value: 'transfer',    label: 'Transfer.' },
]

const statusOptions = [
  { value: 'completed', label: 'Concluída' },
  { value: 'pending',   label: 'Pendente' },
  { value: 'cancelled', label: 'Cancelada' },
]

interface SaleItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  unit: string
}

export default function EditarVendaPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const [saleNumber, setSaleNumber] = useState<number>(0)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [payment, setPayment] = useState('pix')
  const [status, setStatus] = useState('completed')
  const [notes, setNotes] = useState('')
  const [discount, setDiscount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [items, setItems] = useState<SaleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('sales').select('*').eq('id', id).single(),
      supabase.from('sale_items').select('*').eq('sale_id', id).order('id'),
    ]).then(([{ data: sale, error }, { data: saleItems }]) => {
      if (error || !sale) { toast.error('Venda não encontrada'); router.push('/vendas'); return }
      setSaleNumber(sale.sale_number)
      setCustomerName(sale.customer_name ?? '')
      setCustomerPhone((sale as any).customer_phone ?? '')
      setPayment(sale.payment_method ?? 'pix')
      setStatus(sale.status)
      setNotes(sale.notes ?? '')
      setDiscount(sale.discount ?? 0)
      setSubtotal(sale.subtotal ?? 0)
      setItems((saleItems as SaleItem[]) ?? [])
      setLoading(false)
    })
  }, [id])

  const total = Math.max(0, subtotal - discount)

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('sales').update({
        customer_name: customerName.trim() || 'Cliente Avulso',
        customer_phone: customerPhone || null,
        payment_method: payment,
        status,
        notes: notes || null,
        discount,
        discount_percent: subtotal > 0 ? (discount / subtotal) * 100 : 0,
        total,
        updated_at: new Date().toISOString(),
      }).eq('id', id)
      if (error) throw error
      toast.success('Venda atualizada!')
      router.push('/vendas')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Excluir venda #${saleNumber}? Esta ação não pode ser desfeita.`)) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('sale_items').delete().eq('sale_id', id)
      const { error } = await supabase.from('sales').delete().eq('id', id)
      if (error) throw error
      toast.success('Venda excluída.')
      router.push('/vendas')
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    } finally { setDeleting(false) }
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
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingCart size={22} className="text-sky-500" /> Editar Venda
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Venda #{saleNumber}</p>
        </div>
      </div>

      {/* Dados do cliente */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Cliente</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome</label>
            <input className="input-field" value={customerName} onChange={e => setCustomerName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
            <input className="input-field" placeholder="(88) 9 0000-0000" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observações</label>
          <input className="input-field" placeholder="Observações..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>

      {/* Pagamento e status */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Pagamento e Status</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Forma de pagamento</label>
            <select className="input-field text-sm" value={payment} onChange={e => setPayment(e.target.value)}>
              {paymentMethods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
            <select className="input-field text-sm" value={status} onChange={e => setStatus(e.target.value)}>
              {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Desconto (R$)</label>
          <input type="number" className="input-field text-sm" min={0} value={discount} onChange={e => setDiscount(Number(e.target.value))} />
        </div>
        <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-100">
          <span className="text-gray-700">Total</span>
          <span className="text-sky-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Itens */}
      {items.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Itens da Venda</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Produto', 'Qtd', 'Unitário', 'Total'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="px-5 py-2.5 font-medium text-gray-800">{item.product_name}</td>
                  <td className="px-5 py-2.5 text-gray-600">{item.quantity} {item.unit}</td>
                  <td className="px-5 py-2.5 text-gray-600">{formatCurrency(item.unit_price)}</td>
                  <td className="px-5 py-2.5 font-bold text-gray-900">{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Salvar */}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3">
        {saving ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : <><Save size={15} /> Salvar Alterações</>}
      </button>

      {/* Zona de perigo */}
      <div className="card p-5 space-y-3" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
        <h3 className="font-bold text-red-600 text-sm flex items-center gap-2"><Trash2 size={15} /> Zona de Perigo</h3>
        <p className="text-xs text-gray-500">Excluir remove permanentemente esta venda e todos os seus itens.</p>
        <button onClick={handleDelete} disabled={deleting}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          {deleting ? <><Loader2 size={14} className="animate-spin" /> Excluindo...</> : <><Trash2 size={14} /> Excluir Venda</>}
        </button>
      </div>
    </div>
  )
}
