-- ARCHITECTURE: FORTRESS
-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. Agent Memories Table
CREATE TABLE IF NOT EXISTS agent_memories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content text NOT NULL,
    embedding vector(1536), -- Compatible with text-embedding-3-small
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- 4. AEGIS Protocol: Row Level Security
ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;

-- 5. HNSW Index for ultra-fast vector search
CREATE INDEX ON agent_memories USING hnsw (embedding vector_cosine_ops);
