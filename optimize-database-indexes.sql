-- ============================================================
-- SMARTBUGMEDIA — Database Performance & Disk IO Optimization
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vuyspgifpxoqgpbzivaz/sql/new
-- ============================================================

-- 1. Optimize `transactions` table (Stops Full-Table Scans on Stats & Balances)
CREATE INDEX IF NOT EXISTS idx_transactions_type_status 
  ON public.transactions(type, status);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
  ON public.transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at_status 
  ON public.transactions(created_at DESC, status);

CREATE INDEX IF NOT EXISTS idx_transactions_user_created 
  ON public.transactions(user_id, created_at DESC);


-- 2. Optimize `profiles` table (Speeds up Auth, Admin checks & Downlines)
CREATE INDEX IF NOT EXISTS idx_profiles_role 
  ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON public.profiles(email);

CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm 
  ON public.profiles(username);

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code 
  ON public.profiles(referral_code);

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by 
  ON public.profiles(referred_by);


-- 3. Optimize `notifications` table (Speeds up Bell icon & Notification Center)
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, is_read);


-- 4. Optimize `user_tasks` table (Speeds up Task execution & Bundle assignments)
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_status 
  ON public.user_tasks(user_id, status);

CREATE INDEX IF NOT EXISTS idx_user_tasks_task_item_id 
  ON public.user_tasks(task_item_id);


-- 5. Optimize `task_items` catalog
CREATE INDEX IF NOT EXISTS idx_task_items_level_active 
  ON public.task_items(level_id, is_active);


-- 6. Optimize `site_settings`
CREATE INDEX IF NOT EXISTS idx_site_settings_key 
  ON public.site_settings(key);


-- 7. VACUUM ANALYZE to update PostgreSQL query planner statistics immediately
VACUUM ANALYZE public.transactions;
VACUUM ANALYZE public.profiles;
VACUUM ANALYZE public.notifications;
VACUUM ANALYZE public.user_tasks;
VACUUM ANALYZE public.task_items;
