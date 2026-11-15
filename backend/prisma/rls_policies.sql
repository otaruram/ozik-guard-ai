-- ============================================================================
-- OzikSustain — Mandatory PostgreSQL Row-Level Security (RLS) Policies
-- Enforces strict multi-tenant data isolation per user across all core tables.
-- Supports both Supabase Auth (auth.uid()) and Backend Session Context
-- (current_setting('app.current_user_id', true)).
-- ============================================================================

-- 1. Enable RLS on all core tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_audits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_issues" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "badge_verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "regulasi_knowledge_base" ENABLE ROW LEVEL SECURITY;

-- Helper expression notes:
-- COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
-- resolves the active caller ID whether queried via Supabase PostgREST or an RLS-aware session.

-- ============================================================================
-- TABLE: users
-- ============================================================================
DROP POLICY IF EXISTS "users_select_own_or_admin" ON "users";
CREATE POLICY "users_select_own_or_admin"
ON "users"
FOR SELECT
USING (
  id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
  OR role IN ('ADMIN', 'REVIEWER')
);

DROP POLICY IF EXISTS "users_insert_own" ON "users";
CREATE POLICY "users_insert_own"
ON "users"
FOR INSERT
WITH CHECK (
  id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
);

DROP POLICY IF EXISTS "users_update_own" ON "users";
CREATE POLICY "users_update_own"
ON "users"
FOR UPDATE
USING (
  id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
)
WITH CHECK (
  id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
);

-- ============================================================================
-- TABLE: project_audits
-- Each user owns their Green Design Document (PDD) audits ("userId").
-- ADMIN and REVIEWER roles can view & adjudicate audits in the HITL queue.
-- Public / anonymous users can only read verified/approved audits via QR badge.
-- ============================================================================
DROP POLICY IF EXISTS "project_audits_select_own_or_reviewer" ON "project_audits";
CREATE POLICY "project_audits_select_own_or_reviewer"
ON "project_audits"
FOR SELECT
USING (
  "userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
  OR "reviewStatus" = 'APPROVED'
  OR "status" = 'ACTIVE'
  OR EXISTS (
    SELECT 1 FROM "users" u
    WHERE u.id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
      AND u.role IN ('ADMIN', 'REVIEWER')
  )
);

DROP POLICY IF EXISTS "project_audits_insert_own" ON "project_audits";
CREATE POLICY "project_audits_insert_own"
ON "project_audits"
FOR INSERT
WITH CHECK (
  "userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
);

DROP POLICY IF EXISTS "project_audits_update_own_or_reviewer" ON "project_audits";
CREATE POLICY "project_audits_update_own_or_reviewer"
ON "project_audits"
FOR UPDATE
USING (
  "userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
  OR EXISTS (
    SELECT 1 FROM "users" u
    WHERE u.id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
      AND u.role IN ('ADMIN', 'REVIEWER')
  )
);

DROP POLICY IF EXISTS "project_audits_delete_own" ON "project_audits";
CREATE POLICY "project_audits_delete_own"
ON "project_audits"
FOR DELETE
USING (
  "userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
);

-- ============================================================================
-- TABLE: audit_issues
-- Tied via foreign key ("auditId") to "project_audits".
-- ============================================================================
DROP POLICY IF EXISTS "audit_issues_select_via_parent" ON "audit_issues";
CREATE POLICY "audit_issues_select_via_parent"
ON "audit_issues"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "project_audits" pa
    WHERE pa.id = "audit_issues"."auditId"
      AND (
        pa."userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
        OR pa."reviewStatus" = 'APPROVED'
        OR pa."status" = 'ACTIVE'
        OR EXISTS (
          SELECT 1 FROM "users" u
          WHERE u.id = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
            AND u.role IN ('ADMIN', 'REVIEWER')
        )
      )
  )
);

DROP POLICY IF EXISTS "audit_issues_insert_via_parent" ON "audit_issues";
CREATE POLICY "audit_issues_insert_via_parent"
ON "audit_issues"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "project_audits" pa
    WHERE pa.id = "audit_issues"."auditId"
      AND pa."userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
  )
);

DROP POLICY IF EXISTS "audit_issues_delete_via_parent" ON "audit_issues";
CREATE POLICY "audit_issues_delete_via_parent"
ON "audit_issues"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "project_audits" pa
    WHERE pa.id = "audit_issues"."auditId"
      AND pa."userId" = COALESCE(NULLIF(current_setting('app.current_user_id', true), ''), auth.uid()::text)
  )
);

-- ============================================================================
-- TABLE: badge_verifications & regulasi_knowledge_base (Public Read)
-- ============================================================================
DROP POLICY IF EXISTS "badge_verifications_select_public" ON "badge_verifications";
CREATE POLICY "badge_verifications_select_public"
ON "badge_verifications"
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "regulasi_kb_select_public" ON "regulasi_knowledge_base";
CREATE POLICY "regulasi_kb_select_public"
ON "regulasi_knowledge_base"
FOR SELECT
USING (true);
