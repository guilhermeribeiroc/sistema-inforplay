'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'
import { initials } from '@/lib/utils'
import {
  LayoutDashboard, ShoppingCart, FileText, ClipboardList,
  Kanban, Package, Users, Users2, TrendingUp, Settings, LogOut,
  ChevronLeft, ChevronRight, UserCircle, Wrench,
} from 'lucide-react'
import Image from 'next/image'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  adminOnly?: boolean
  badge?: number
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',      href: '/',                adminOnly: true },
  { icon: ShoppingCart,    label: 'Vendas',            href: '/vendas' },
  { icon: FileText,        label: 'Orçamentos',       href: '/orcamentos' },
  { icon: ClipboardList,   label: 'Ordens de Serviço', href: '/ordens-servico' },
  { icon: Kanban,          label: 'Status',            href: '/status' },
  { icon: Users2,          label: 'Clientes',          href: '/clientes' },
  { icon: Package,         label: 'Estoque',           href: '/estoque',         adminOnly: true },
  { icon: Users,           label: 'Funcionários',      href: '/funcionarios',    adminOnly: true },
  { icon: Wrench,          label: 'Terceirizados',    href: '/terceirizados',   adminOnly: true },
  { icon: TrendingUp,      label: 'Relatórios',       href: '/relatorios',      adminOnly: true },
  { icon: Settings,        label: 'Configurações',    href: '/configuracoes' },
]

interface SidebarProps {
  profile: Profile
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const isAdmin = profile.role === 'admin'
  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="relative flex flex-col h-screen shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 72 : 240,
        background: 'linear-gradient(180deg, #080d1a 0%, #0f1729 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: '#0f1729',
          border: '1.5px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div
        className="flex flex-col items-center px-3 py-3 gap-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {collapsed ? (
          /* Collapsed: só o ícone IP */
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
            IP
          </div>
        ) : (
          /* Expanded: logo completa */
          <div className="w-full">
            <Image
              src="/logo.png"
              alt="Inforplay"
              width={847}
              height={373}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              priority
            />
            <span className="flex items-center justify-center gap-1.5 mt-1.5 text-xs font-bold"
              style={{ color: '#38bdf8', fontSize: 9, letterSpacing: '0.1em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
              {isAdmin ? 'GERENTE' : 'FUNCIONÁRIO'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            Menu
          </p>
        )}

        {visibleItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="sidebar-link w-full"
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                ...(active ? {
                  background: 'rgba(14,165,233,0.15)',
                  color: '#38bdf8',
                  boxShadow: 'inset 0 0 0 1px rgba(14,165,233,0.2)',
                } : {}),
              }}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#0ea5e9', color: '#fff' }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User profile + logout */}
      <div
        className="px-3 pb-4 pt-3 space-y-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Profile */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
          >
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-8 h-8 rounded-full object-cover" alt={profile.name} />
              : initials(profile.name)
            }
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {profile.email}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
