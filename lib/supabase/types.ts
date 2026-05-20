export type UserRole = 'admin' | 'employee'
export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'
export type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'converted'
export type OSStatus = 'open' | 'in_progress' | 'waiting_third_party' | 'ready' | 'delivered' | 'cancelled'
export type OSPriority = 'low' | 'normal' | 'high' | 'urgent'
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'transfer' | 'other'
export type ProductUnit = 'UN' | 'M2' | 'M' | 'HH' | 'KG' | 'L' | 'CX'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
  phone: string | null
  active: boolean
  monthly_goal: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  code: string
  name: string
  sector: string
  unit: ProductUnit
  cost: number
  sale_price: number
  stock_quantity: number
  min_stock: number
  active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string | null
  email: string | null
  document: string | null
  address: string | null
  city: string | null
  state: string | null
  notes: string | null
  total_purchases: number
  created_at: string
  updated_at: string
}

export interface ThirdParty {
  id: string
  name: string
  service: string | null
  phone: string | null
  email: string | null
  document: string | null
  address: string | null
  rating: number
  total_orders: number
  total_paid: number
  delivery_avg_days: number
  active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  sale_number: number
  customer_id: string | null
  customer_name: string
  employee_id: string | null
  employee_name: string | null
  status: SaleStatus
  subtotal: number
  discount: number
  discount_percent: number
  total: number
  payment_method: PaymentMethod
  notes: string | null
  sale_date: string
  created_at: string
  updated_at: string
  sale_items?: SaleItem[]
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string | null
  product_code: string
  product_name: string
  quantity: number
  unit: string
  unit_price: number
  cost_price: number
  total_price: number
  created_at: string
}

export interface Quote {
  id: string
  quote_number: number
  customer_id: string | null
  customer_name: string
  employee_id: string | null
  employee_name: string | null
  status: QuoteStatus
  subtotal: number
  discount: number
  discount_percent: number
  total: number
  valid_days: number
  valid_until: string
  notes: string | null
  converted_sale_id: string | null
  created_at: string
  updated_at: string
  quote_items?: QuoteItem[]
}

export interface QuoteItem {
  id: string
  quote_id: string
  product_id: string | null
  product_code: string
  product_name: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  created_at: string
}

export interface ServiceOrder {
  id: string
  os_number: number
  customer_id: string | null
  customer_name: string
  customer_phone: string | null
  employee_id: string | null
  employee_name: string | null
  third_party_id: string | null
  third_party_name: string | null
  status: OSStatus
  priority: OSPriority
  title: string
  description: string | null
  subtotal: number
  discount: number
  total: number
  amount_paid: number
  estimated_date: string | null
  delivery_date: string | null
  image_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  service_order_items?: ServiceOrderItem[]
}

export interface ServiceOrderItem {
  id: string
  os_id: string
  product_id: string | null
  product_code: string
  product_name: string
  quantity: number
  unit: string
  unit_price: number
  cost_price: number
  total_price: number
  created_at: string
}

export interface DashboardSummary {
  today_revenue: number
  month_revenue: number
  month_sales_count: number
  pending_orders: number
  ready_orders: number
  pending_quotes: number
  active_employees: number
}

export interface SellerRanking {
  employee_id: string
  employee_name: string
  avatar_url: string | null
  total_sales: number
  total_revenue: number
  ranking: number
}

// Supabase Database type stub (generate full with: npx supabase gen types)
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> }
      customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> }
      third_parties: { Row: ThirdParty; Insert: Partial<ThirdParty>; Update: Partial<ThirdParty> }
      sales: { Row: Sale; Insert: Partial<Sale>; Update: Partial<Sale> }
      sale_items: { Row: SaleItem; Insert: Partial<SaleItem>; Update: Partial<SaleItem> }
      quotes: { Row: Quote; Insert: Partial<Quote>; Update: Partial<Quote> }
      quote_items: { Row: QuoteItem; Insert: Partial<QuoteItem>; Update: Partial<QuoteItem> }
      service_orders: { Row: ServiceOrder; Insert: Partial<ServiceOrder>; Update: Partial<ServiceOrder> }
      service_order_items: { Row: ServiceOrderItem; Insert: Partial<ServiceOrderItem>; Update: Partial<ServiceOrderItem> }
    }
    Views: {
      v_dashboard_summary: { Row: DashboardSummary }
      v_seller_ranking_current_month: { Row: SellerRanking }
    }
    Functions: Record<string, never>
  }
}
