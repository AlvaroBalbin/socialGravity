// src/lib/api.ts

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ootcwmipvdlyvjcvdtpo.supabase.co';

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.warn(
    '[api] VITE_SUPABASE_ANON_KEY is not set. Requests to edge functions will fail.'
  );
}

export async function callEdge<T = any>(
  fn: string,
  body: unknown
): Promise<T> {
  const url = `${SUPABASE_URL}/functions/v1/${fn}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Both headers are safe + recommended for Supabase from the browser
        apikey: SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${SUPABASE_ANON_KEY || ''}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Edge function ${fn} failed: ${res.status} ${res.statusText} - ${text}`
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error(`[api] Network error calling edge function ${fn} at ${url}`, err);
    // Re-throw so callers see a useful message
    throw err;
  }
}
