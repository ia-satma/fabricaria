
-- PASO 168: LA FORTALEZA DE DATOS (RLS Multi-Inquilino)
-- Objetivo: Garantizar aislamiento a nivel de motor de DB.

-- 1. Habilitar RLS en tablas críticas
ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- 2. Crear Política de Aislamiento por tenant_id
-- Asumimos que tenant_id es una columna UUID en estas tablas.
CREATE POLICY tenant_isolation_policy ON agent_memories
USING (tenant_id::text = current_setting('app.current_tenant', true));

CREATE POLICY tenant_isolation_policy ON token_usage_logs
USING (tenant_id::text = current_setting('app.current_tenant', true));

-- 3. Función para establecer el contexto del inquilino (Step 168 logic)
-- EX: SELECT set_config('app.current_tenant', 'uuid-here', true);
