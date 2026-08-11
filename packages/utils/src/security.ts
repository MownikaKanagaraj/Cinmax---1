export interface EnvValidationResult {
  valid: boolean;
  missingVars: string[];
}

export function validateEnvSecrets(requiredVars?: string[]): EnvValidationResult {
  const defaults = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const targetVars = requiredVars || defaults;
  const missingVars: string[] = [];

  targetVars.forEach((varName) => {
    const envObj = (globalThis as Record<string, any>).process?.env || {};
    const val = envObj[varName];
    if (!val || val.includes('your-project') || val.includes('your-supabase')) {
      missingVars.push(varName);
    }
  });

  return {
    valid: missingVars.length === 0,
    missingVars,
  };
}

export const SECURITY_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.razorpay.com wss://*.supabase.co;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")',
};

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
