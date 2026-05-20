import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: 'Aberta',
    in_progress: 'Em Andamento',
    waiting_third_party: 'Aguardando Terceiro',
    ready: 'Pronta',
    delivered: 'Entregue',
    cancelled: 'Cancelada',
    pending: 'Pendente',
    completed: 'Concluída',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    expired: 'Expirado',
    converted: 'Convertido',
    refunded: 'Estornado',
  }
  return labels[status] ?? status
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente',
  }
  return labels[priority] ?? priority
}

export function getPaymentLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: 'Dinheiro',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    transfer: 'Transferência',
    other: 'Outro',
  }
  return labels[method] ?? method
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
