-- ============================================================
-- INFORPLAY - Políticas de Segurança (Row Level Security)
-- Execute APÓS o schema.sql
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE third_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: verificar role do usuário logado
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- POLÍTICAS: profiles
-- ============================================================
-- Todos os usuários autenticados podem ver perfis (para listas de funcionários)
CREATE POLICY "profiles_select_authenticated" ON profiles
  FOR SELECT TO authenticated USING (TRUE);

-- Usuário pode atualizar APENAS seu próprio perfil
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- Apenas admin pode inserir/deletar perfis
CREATE POLICY "profiles_all_admin" ON profiles
  FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: products
-- ============================================================
-- Todos autenticados podem ver produtos
CREATE POLICY "products_select_all" ON products
  FOR SELECT TO authenticated USING (TRUE);

-- Apenas admin pode criar/editar/deletar produtos
CREATE POLICY "products_write_admin" ON products
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: customers
-- ============================================================
CREATE POLICY "customers_select_all" ON customers
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "customers_insert_all" ON customers
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "customers_update_all" ON customers
  FOR UPDATE TO authenticated USING (TRUE);

CREATE POLICY "customers_delete_admin" ON customers
  FOR DELETE TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: third_parties
-- ============================================================
CREATE POLICY "third_parties_select_all" ON third_parties
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "third_parties_write_admin" ON third_parties
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "third_parties_update_admin" ON third_parties
  FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "third_parties_delete_admin" ON third_parties
  FOR DELETE TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: sales
-- ============================================================
-- Funcionários veem apenas as PRÓPRIAS vendas; Admin vê todas
CREATE POLICY "sales_select" ON sales
  FOR SELECT TO authenticated
  USING (
    is_admin() OR employee_id = auth.uid()
  );

CREATE POLICY "sales_insert" ON sales
  FOR INSERT TO authenticated
  WITH CHECK (employee_id = auth.uid() OR is_admin());

-- Funcionário pode atualizar suas próprias vendas (ex: cancelar antes de fechar)
-- Admin pode atualizar qualquer venda
CREATE POLICY "sales_update" ON sales
  FOR UPDATE TO authenticated
  USING (employee_id = auth.uid() OR is_admin());

CREATE POLICY "sales_delete_admin" ON sales
  FOR DELETE TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: sale_items
-- ============================================================
CREATE POLICY "sale_items_select" ON sale_items
  FOR SELECT TO authenticated
  USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_id AND sales.employee_id = auth.uid())
  );

CREATE POLICY "sale_items_write" ON sale_items
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "sale_items_delete" ON sale_items
  FOR DELETE TO authenticated
  USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_id AND sales.employee_id = auth.uid())
  );

-- ============================================================
-- POLÍTICAS: quotes
-- ============================================================
CREATE POLICY "quotes_select" ON quotes
  FOR SELECT TO authenticated
  USING (is_admin() OR employee_id = auth.uid());

CREATE POLICY "quotes_insert" ON quotes
  FOR INSERT TO authenticated
  WITH CHECK (employee_id = auth.uid() OR is_admin());

CREATE POLICY "quotes_update" ON quotes
  FOR UPDATE TO authenticated
  USING (employee_id = auth.uid() OR is_admin());

CREATE POLICY "quotes_delete_admin" ON quotes
  FOR DELETE TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: quote_items
-- ============================================================
CREATE POLICY "quote_items_select" ON quote_items
  FOR SELECT TO authenticated
  USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_id AND quotes.employee_id = auth.uid())
  );

CREATE POLICY "quote_items_write" ON quote_items
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "quote_items_delete" ON quote_items
  FOR DELETE TO authenticated USING (TRUE);

-- ============================================================
-- POLÍTICAS: service_orders
-- ============================================================
-- Todos autenticados veem todas as OS (necessário para o painel de status)
CREATE POLICY "os_select_all" ON service_orders
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "os_insert" ON service_orders
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "os_update" ON service_orders
  FOR UPDATE TO authenticated
  USING (employee_id = auth.uid() OR is_admin());

CREATE POLICY "os_delete_admin" ON service_orders
  FOR DELETE TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: service_order_items
-- ============================================================
CREATE POLICY "os_items_select" ON service_order_items
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "os_items_write" ON service_order_items
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "os_items_delete" ON service_order_items
  FOR DELETE TO authenticated USING (is_admin() OR TRUE);

-- ============================================================
-- POLÍTICAS: expenses (apenas admin)
-- ============================================================
CREATE POLICY "expenses_admin_only" ON expenses
  FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- POLÍTICAS: stock_movements
-- ============================================================
CREATE POLICY "stock_select_all" ON stock_movements
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "stock_write_admin" ON stock_movements
  FOR INSERT TO authenticated WITH CHECK (is_admin() OR TRUE);

-- ============================================================
-- Garantir acesso às views para usuários autenticados
-- ============================================================
GRANT SELECT ON v_monthly_sales TO authenticated;
GRANT SELECT ON v_seller_ranking_current_month TO authenticated;
GRANT SELECT ON v_dashboard_summary TO authenticated;
