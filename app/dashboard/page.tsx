import { redirect } from 'next/navigation'

// /dashboard just redirects to root which handles the logic
export default function DashboardRedirect() {
  redirect('/')
}
