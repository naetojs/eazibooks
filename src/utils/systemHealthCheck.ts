import { supabase } from './supabase/client';

export interface HealthCheckResult {
  isDatabaseReady: boolean;
  isStorageReady: boolean;
  isAuthReady: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Performs a comprehensive health check of the Supabase setup
 * Returns status of database tables, storage buckets, and auth
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isDatabaseReady = true;
  let isStorageReady = true;
  let isAuthReady = true;

  // Check Authentication
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      errors.push(`Auth error: ${error.message}`);
      isAuthReady = false;
    }
  } catch (error: any) {
    errors.push(`Auth check failed: ${error.message}`);
    isAuthReady = false;
  }

  // Check Database Tables
  try {
    // Try to query the profiles table
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError) {
      if (profilesError.message.includes('relation') || profilesError.message.includes('does not exist')) {
        errors.push('Database tables not found. Run SUPABASE_SCHEMA.sql');
        isDatabaseReady = false;
      } else if (profilesError.message.includes('JWT')) {
        warnings.push('Authentication issue detected');
      } else {
        warnings.push(`Database warning: ${profilesError.message}`);
      }
    }

    // Try to query the companies table
    const { error: companiesError } = await supabase
      .from('companies')
      .select('id')
      .limit(1);

    if (companiesError && companiesError.message.includes('relation')) {
      if (!errors.includes('Database tables not found. Run SUPABASE_SCHEMA.sql')) {
        errors.push('Some database tables missing. Re-run SUPABASE_SCHEMA.sql');
      }
      isDatabaseReady = false;
    }

    // Try to query subscriptions table
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);

    if (subscriptionsError && subscriptionsError.message.includes('relation')) {
      if (!errors.includes('Database tables not found. Run SUPABASE_SCHEMA.sql')) {
        errors.push('Some database tables missing. Re-run SUPABASE_SCHEMA.sql');
      }
      isDatabaseReady = false;
    }
  } catch (error: any) {
    errors.push(`Database check failed: ${error.message}`);
    isDatabaseReady = false;
  }

  // Check Storage Buckets
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      warnings.push(`Storage check warning: ${bucketsError.message}`);
    } else if (buckets) {
      const hasCompanyAssets = buckets.some(b => b.name === 'company-assets');
      const hasUserAssets = buckets.some(b => b.name === 'user-assets');

      if (!hasCompanyAssets || !hasUserAssets) {
        const missing = [];
        if (!hasCompanyAssets) missing.push('company-assets');
        if (!hasUserAssets) missing.push('user-assets');
        warnings.push(`Missing storage buckets: ${missing.join(', ')}`);
        isStorageReady = false;
      }
    }
  } catch (error: any) {
    warnings.push(`Storage check failed: ${error.message}`);
    isStorageReady = false;
  }

  return {
    isDatabaseReady,
    isStorageReady,
    isAuthReady,
    errors,
    warnings
  };
}

/**
 * Quick check to see if the basic database is ready
 * Used for conditional rendering
 */
export async function isDatabaseSetup(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    return !error || !error.message.includes('relation');
  } catch {
    return false;
  }
}
