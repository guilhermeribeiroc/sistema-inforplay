-- ============================================================
-- INFORPLAY - Schema Completo do Banco de Dados
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- TABELA: profiles (extensão do auth.users do Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  avatar_url TEXT,
  phone TEXT,
  active BOOLEAN DEFAULT TRUE,
  monthly_goal DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: products (estoque de materiais)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sector TEXT DEFAULT 'ALMOXARIFADO',
  unit TEXT NOT NULL DEFAULT 'UN' CHECK (unit IN ('UN', 'M2', 'M', 'HH', 'KG', 'L', 'CX')),
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity DECIMAL(10,3) DEFAULT 0,
  min_stock DECIMAL(10,3) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca rápida de produtos
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- ============================================================
-- TABELA: customers (clientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  document TEXT,
  address TEXT,
  city TEXT DEFAULT 'Morada Nova',
  state TEXT DEFAULT 'CE',
  notes TEXT,
  total_purchases DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_name ON customers USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_document ON customers(document);

-- ============================================================
-- TABELA: third_parties (prestadores terceirizados)
-- ============================================================
CREATE TABLE IF NOT EXISTS third_parties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  service TEXT,
  phone TEXT,
  email TEXT,
  document TEXT,
  address TEXT,
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_orders INTEGER DEFAULT 0,
  total_paid DECIMAL(10,2) DEFAULT 0,
  delivery_avg_days INTEGER DEFAULT 3,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: sales (vendas)
-- ============================================================
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_number BIGINT GENERATED ALWAYS AS IDENTITY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL DEFAULT 'Cliente Avulso',
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  employee_name TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'pix' CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'pix', 'transfer', 'other')),
  notes TEXT,
  sale_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_employee ON sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);

-- ============================================================
-- TABELA: sale_items (itens das vendas)
-- ============================================================
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'UN',
  unit_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);

-- ============================================================
-- TABELA: quotes (orçamentos)
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number BIGINT GENERATED ALWAYS AS IDENTITY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL DEFAULT 'Cliente Avulso',
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  employee_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'converted')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  valid_days INTEGER DEFAULT 7,
  valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
  notes TEXT,
  converted_sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_employee ON quotes(employee_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- ============================================================
-- TABELA: quote_items (itens dos orçamentos)
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'UN',
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: service_orders (ordens de serviço)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  os_number BIGINT GENERATED ALWAYS AS IDENTITY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL DEFAULT 'Cliente Avulso',
  customer_phone TEXT,
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  employee_name TEXT,
  third_party_id UUID REFERENCES third_parties(id) ON DELETE SET NULL,
  third_party_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_third_party', 'ready', 'delivered', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  title TEXT NOT NULL,
  description TEXT,
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  estimated_date DATE,
  delivery_date DATE,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_os_employee ON service_orders(employee_id);
CREATE INDEX IF NOT EXISTS idx_os_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_os_date ON service_orders(created_at);

-- ============================================================
-- TABELA: service_order_items (itens das OS)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  os_id UUID REFERENCES service_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'UN',
  unit_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: expenses (despesas da empresa)
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('salary', 'rent', 'supplies', 'third_party', 'equipment', 'marketing', 'other')),
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  third_party_id UUID REFERENCES third_parties(id) ON DELETE SET NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- ============================================================
-- TABELA: stock_movements (movimentações de estoque)
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity DECIMAL(10,3) NOT NULL,
  balance_after DECIMAL(10,3),
  reference_type TEXT CHECK (reference_type IN ('sale', 'service_order', 'manual', 'purchase')),
  reference_id UUID,
  notes TEXT,
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_date ON stock_movements(created_at);

-- ============================================================
-- TRIGGERS: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_sales BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_quotes BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_service_orders BEFORE UPDATE ON service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: criar profile automaticamente ao registrar usuário
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: baixa automática de estoque nas vendas
-- ============================================================
CREATE OR REPLACE FUNCTION deduct_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;

    INSERT INTO stock_movements (product_id, type, quantity, balance_after, reference_type, reference_id)
    SELECT
      NEW.product_id,
      'out',
      NEW.quantity,
      p.stock_quantity,
      'sale',
      NEW.sale_id
    FROM products p WHERE p.id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- VIEWS úteis para relatórios
-- ============================================================

-- View: resumo mensal de vendas por funcionário
CREATE OR REPLACE VIEW v_monthly_sales AS
SELECT
  p.id AS employee_id,
  p.name AS employee_name,
  DATE_TRUNC('month', s.sale_date) AS month,
  COUNT(s.id) AS total_sales,
  SUM(s.total) AS total_revenue,
  SUM(s.total - COALESCE(
    (SELECT SUM(si.cost_price * si.quantity) FROM sale_items si WHERE si.sale_id = s.id), 0
  )) AS total_profit,
  AVG(s.total) AS avg_ticket
FROM profiles p
LEFT JOIN sales s ON s.employee_id = p.id AND s.status = 'completed'
GROUP BY p.id, p.name, DATE_TRUNC('month', s.sale_date);

-- View: ranking de vendedores do mês atual
CREATE OR REPLACE VIEW v_seller_ranking_current_month AS
SELECT
  p.id AS employee_id,
  p.name AS employee_name,
  p.avatar_url,
  COUNT(s.id) AS total_sales,
  COALESCE(SUM(s.total), 0) AS total_revenue,
  RANK() OVER (ORDER BY COALESCE(SUM(s.total), 0) DESC) AS ranking
FROM profiles p
LEFT JOIN sales s ON s.employee_id = p.id
  AND s.status = 'completed'
  AND DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE)
WHERE p.role = 'employee' AND p.active = TRUE
GROUP BY p.id, p.name, p.avatar_url
ORDER BY total_revenue DESC;

-- View: resumo do dashboard do gerente
CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT
  (SELECT COALESCE(SUM(total), 0) FROM sales WHERE status = 'completed' AND sale_date = CURRENT_DATE) AS today_revenue,
  (SELECT COALESCE(SUM(total), 0) FROM sales WHERE status = 'completed' AND DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)) AS month_revenue,
  (SELECT COUNT(*) FROM sales WHERE status = 'completed' AND DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)) AS month_sales_count,
  (SELECT COUNT(*) FROM service_orders WHERE status NOT IN ('delivered', 'cancelled')) AS pending_orders,
  (SELECT COUNT(*) FROM service_orders WHERE status = 'ready') AS ready_orders,
  (SELECT COUNT(*) FROM quotes WHERE status = 'pending') AS pending_quotes,
  (SELECT COUNT(*) FROM profiles WHERE active = TRUE AND role = 'employee') AS active_employees;
