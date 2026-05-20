import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Root page: redirect based on role
export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single() as { data: { role: string } | null }

  if (profile?.role === 'admin') redirect('/dashboard')
  else redirect('/status')
}
