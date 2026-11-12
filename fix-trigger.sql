-- ============================================================
-- SMARTBUGMEDIA — Supabase Profile Trigger Fix
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vuyspgifpxoqgpbzivaz/sql/new
-- ============================================================

-- 1. Create or replace the function that handles new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  v_referred_by UUID;
  v_welcome_balance NUMERIC;
  v_referral_code TEXT;
BEGIN
  -- Generate unique referral code from user ID
  v_referral_code := UPPER(SUBSTRING(NEW.id::TEXT, 1, 4));
  
  -- Read referred_by from auth metadata if present
  IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
    BEGIN
      v_referred_by := (NEW.raw_user_meta_data->>'referred_by')::UUID;
    EXCEPTION WHEN OTHERS THEN
      v_referred_by := NULL;
    END;
  END IF;
  
  -- Also check referral_code_used to find inviter if referred_by not directly set
  IF v_referred_by IS NULL AND NEW.raw_user_meta_data->>'referral_code_used' IS NOT NULL THEN
    SELECT id INTO v_referred_by
    FROM public.profiles
    WHERE referral_code = UPPER(NEW.raw_user_meta_data->>'referral_code_used')
    LIMIT 1;
  END IF;

  -- Get welcome balance from metadata or default to 25
  IF NEW.raw_user_meta_data->>'wallet_balance' IS NOT NULL THEN
    v_welcome_balance := (NEW.raw_user_meta_data->>'wallet_balance')::NUMERIC;
  ELSE
    v_welcome_balance := 25.00;
  END IF;

  -- Insert the profile row
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    email,
    phone_number,
    role,
    wallet_balance,
    referral_code,
    referral_code_used,
    referred_by,
    withdrawal_password,
    is_active,
    is_admin,
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
    v_welcome_balance,
    v_referral_code,
    NEW.raw_user_meta_data->>'referral_code_used',
    v_referred_by,
    NEW.raw_user_meta_data->>'withdrawal_password',
    TRUE,
    CASE WHEN LOWER(NEW.email) = 'infosmartbugmedia@gmail.com' THEN TRUE ELSE COALESCE((NEW.raw_user_meta_data->>'is_admin')::BOOLEAN, FALSE) END,
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

-- 2. Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Verify the trigger was created
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 4. Promote existing account to admin immediately
UPDATE public.profiles 
SET role = 'admin', is_admin = TRUE 
WHERE LOWER(email) = 'infosmartbugmedia@gmail.com';
