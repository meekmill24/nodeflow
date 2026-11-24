-- ============================================================
-- SMARTBUGMEDIA — Complete Database Setup & Schema
-- Run this in your NEW Supabase project's SQL Editor:
-- https://supabase.com/dashboard/project/<new-project-ref>/sql/new
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TABLES
-- ============================================================

-- Levels Table
CREATE TABLE IF NOT EXISTS public.levels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    commission_rate NUMERIC NOT NULL DEFAULT 0.005,
    tasks_per_set INT NOT NULL DEFAULT 40,
    sets_per_day INT NOT NULL DEFAULT 1,
    description TEXT,
    badge_color TEXT DEFAULT '#3DD6C8',
    min_withdrawal NUMERIC DEFAULT 30,
    max_withdrawal NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    email TEXT,
    phone_number TEXT,
    role TEXT DEFAULT 'user',
    is_admin BOOLEAN DEFAULT FALSE,
    level_id INT REFERENCES public.levels(id) DEFAULT 1,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_code_used TEXT,
    wallet_balance NUMERIC DEFAULT 25.00,
    profit NUMERIC DEFAULT 0.00,
    total_earned NUMERIC DEFAULT 0.00,
    freeze_balance NUMERIC DEFAULT 0.00,
    bonus_balance NUMERIC DEFAULT 0.00,
    referral_earned NUMERIC DEFAULT 0.00,
    pending_bundle JSONB DEFAULT '[]'::jsonb,
    referred_users_count INT DEFAULT 0,
    avatar_url TEXT,
    completed_count INT DEFAULT 0,
    current_set INT DEFAULT 1,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    wallet_address TEXT,
    wallet_network TEXT DEFAULT 'TRX',
    withdrawal_wallet_address TEXT,
    withdrawal_password TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_frozen BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'unverified',
    tasks_per_set_override INT,
    sets_per_day_override INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Items Catalog
CREATE TABLE IF NOT EXISTS public.task_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Optimization',
    level_id INT REFERENCES public.levels(id) DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Task Submissions
CREATE TABLE IF NOT EXISTS public.user_tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_item_id INT REFERENCES public.task_items(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, completed, cancelled
    earned_amount NUMERIC DEFAULT 0,
    cost_amount NUMERIC DEFAULT 0,
    is_bundle BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (Deposits, Withdrawals, Commissions)
CREATE TABLE IF NOT EXISTS public.transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- deposit, withdrawal, commission, freeze, unfreeze
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    network TEXT DEFAULT 'TRX',
    address TEXT,
    description TEXT,
    proof_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Ledger (Audit History)
CREATE TABLE IF NOT EXISTS public.transaction_ledger (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, danger
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (Global Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle Packages (VIP Special Bundles)
CREATE TABLE IF NOT EXISTS public.bundle_packages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    target_index INT DEFAULT 35,
    shortage_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 100,
    bonus_amount NUMERIC DEFAULT 20,
    rate NUMERIC DEFAULT 0.20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Codes Lookup
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    uses_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. INDEXES (Prevents Disk IO Exhaustion)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_transactions_type_status ON public.transactions(type, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC, status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_status ON public.user_tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_task_items_level_active ON public.task_items(level_id, is_active);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- ============================================================
-- 3. AUTH TRIGGER (Automatically provisions profile on signup)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_referred_by UUID := NULL;
  v_welcome_balance NUMERIC := 25.00;
  v_referral_code TEXT;
BEGIN
  -- Generate unique 4-character referral code
  v_referral_code := UPPER(SUBSTRING(NEW.id::TEXT, 1, 4));

  -- Resolve inviter from metadata
  IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
    BEGIN
      v_referred_by := (NEW.raw_user_meta_data->>'referred_by')::UUID;
    EXCEPTION WHEN OTHERS THEN
      v_referred_by := NULL;
    END;
  END IF;

  IF v_referred_by IS NULL AND NEW.raw_user_meta_data->>'referral_code_used' IS NOT NULL THEN
    SELECT id INTO v_referred_by
    FROM public.profiles
    WHERE referral_code = UPPER(NEW.raw_user_meta_data->>'referral_code_used')
    LIMIT 1;
  END IF;

  IF NEW.raw_user_meta_data->>'wallet_balance' IS NOT NULL THEN
    v_welcome_balance := (NEW.raw_user_meta_data->>'wallet_balance')::NUMERIC;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    email,
    phone_number,
    role,
    is_admin,
    wallet_balance,
    referral_code,
    referral_code_used,
    referred_by,
    withdrawal_password,
    is_active,
    level_id,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number',
    CASE WHEN LOWER(NEW.email) = 'infosmartbugmedia@gmail.com' THEN 'admin' ELSE 'user' END,
    CASE WHEN LOWER(NEW.email) = 'infosmartbugmedia@gmail.com' THEN TRUE ELSE COALESCE((NEW.raw_user_meta_data->>'is_admin')::BOOLEAN, FALSE) END,
    v_welcome_balance,
    v_referral_code,
    NEW.raw_user_meta_data->>'referral_code_used',
    v_referred_by,
    NEW.raw_user_meta_data->>'withdrawal_password',
    TRUE,
    1,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = CASE WHEN LOWER(EXCLUDED.email) = 'infosmartbugmedia@gmail.com' THEN 'admin' ELSE profiles.role END,
    is_admin = CASE WHEN LOWER(EXCLUDED.email) = 'infosmartbugmedia@gmail.com' THEN TRUE ELSE profiles.is_admin END,
    referred_by = COALESCE(EXCLUDED.referred_by, profiles.referred_by),
    referral_code_used = COALESCE(EXCLUDED.referral_code_used, profiles.referral_code_used),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. DEFAULT SEED DATA
-- ============================================================

-- Insert default VIP Levels
INSERT INTO public.levels (id, name, price, commission_rate, tasks_per_set, sets_per_day, description, badge_color, min_withdrawal, max_withdrawal)
VALUES
  (1, 'VIP 1 - Junior Agent', 0, 0.005, 40, 1, 'Standard Entry Level', '#3DD6C8', 30, 1499),
  (2, 'VIP 2 - Intermediate', 500, 0.008, 45, 2, 'Accelerated Commission Tier', '#3B82F6', 30, 2499),
  (3, 'VIP 3 - Senior Agent', 1500, 0.012, 50, 3, 'High Yield Tier', '#8B5CF6', 30, 4999),
  (4, 'VIP 4 - Mentor Agent', 5000, 0.018, 55, 4, 'Elite Unlimited Tier', '#F59E0B', 30, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert default Site Settings
INSERT INTO public.site_settings (key, value, description)
VALUES
  ('welcome_bonus', '25', 'First user registration signup bonus credit in USD'),
  ('signup_bonus', '2', 'Referrer signup bonus credit in USD'),
  ('min_deposit', '10', 'Minimum allowed deposit in USD'),
  ('min_withdrawal', '30', 'Minimum allowed withdrawal in USD'),
  ('referral_commission_l1', '20', 'Tier 1 Referral Commission Percentage'),
  ('referral_commission_l2', '10', 'Tier 2 Referral Commission Percentage'),
  ('referral_commission_l3', '5', 'Tier 3 Referral Commission Percentage'),
  ('working_hours_enabled', 'false', 'Enable operational working hours restrictions'),
  ('require_task_completion_to_withdraw', 'true', 'Require set completion before requesting withdrawal')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 5. STORAGE BUCKETS SETUP
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('deposit_proofs', 'deposit_proofs', true),
  ('avatars', 'avatars', true),
  ('product_images', 'product_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Public Read Policy
CREATE POLICY "Public Access deposit_proofs" ON storage.objects FOR SELECT USING (bucket_id = 'deposit_proofs');
CREATE POLICY "Public Upload deposit_proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'deposit_proofs');

CREATE POLICY "Public Access avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Public Access product_images" ON storage.objects FOR SELECT USING (bucket_id = 'product_images');
CREATE POLICY "Public Upload product_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images');



-- ============================================================
-- 6. RPC FUNCTIONS FOR TASK ENGINE & SALARY
-- ============================================================

CREATE OR REPLACE FUNCTION public.complete_user_task(
  p_task_item_id INT,
  p_cost_amount NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_profile RECORD;
  v_level RECORD;
  v_item RECORD;
  v_cost_amount NUMERIC;
  v_commission_rate NUMERIC;
  v_earned_amount NUMERIC;
  v_new_balance NUMERIC;
  v_task_id INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Identity Shard not found.';
  END IF;

  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Identity Shard not found.';
  END IF;

  IF v_profile.is_frozen IS TRUE THEN
    RAISE EXCEPTION 'Account node is frozen. Contact support.';
  END IF;

  SELECT * INTO v_item FROM public.task_items WHERE id = p_task_item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Node Item not found.';
  END IF;

  v_cost_amount := COALESCE(p_cost_amount, v_profile.wallet_balance);
  IF v_profile.wallet_balance < v_cost_amount THEN
    RAISE EXCEPTION 'Insufficient Liquidity for Optimization.';
  END IF;

  SELECT * INTO v_level FROM public.levels WHERE id = v_profile.level_id;
  v_commission_rate := COALESCE(v_level.commission_rate, 0.004);
  v_earned_amount := ROUND((v_cost_amount * v_commission_rate)::NUMERIC, 2);
  v_new_balance := ROUND((v_profile.wallet_balance + v_earned_amount)::NUMERIC, 2);

  INSERT INTO public.user_tasks (
    user_id,
    task_item_id,
    status,
    cost_amount,
    earned_amount,
    is_bundle,
    completed_at,
    created_at
  ) VALUES (
    v_user_id,
    p_task_item_id,
    'completed',
    v_cost_amount,
    v_earned_amount,
    FALSE,
    NOW(),
    NOW()
  ) RETURNING id INTO v_task_id;

  INSERT INTO public.transaction_ledger (
    user_id,
    amount,
    type,
    description,
    created_at
  ) VALUES (
    v_user_id,
    v_earned_amount,
    'task_rebate',
    'Yield optimization from ' || COALESCE(v_level.name, 'Node LV.1'),
    NOW()
  );

  UPDATE public.profiles SET
    completed_count = COALESCE(completed_count, 0) + 1,
    wallet_balance = v_new_balance,
    profit = ROUND((COALESCE(profit, 0) + v_earned_amount)::NUMERIC, 2),
    total_earned = ROUND((COALESCE(total_earned, 0) + v_earned_amount)::NUMERIC, 2),
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'task_id', v_task_id,
    'is_bundle', FALSE,
    'new_balance', v_new_balance,
    'earned_amount', v_earned_amount
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_salary_bonus()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object(
    'success', FALSE,
    'message', 'Salary protocol offline. Contact admin.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_user_task(INT, NUMERIC) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.claim_salary_bonus() TO authenticated, service_role, anon;
