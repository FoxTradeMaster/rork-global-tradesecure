import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[API] Missing Supabase configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        participants: []
      });
    }

    // Create Supabase client with service role key (server-side only)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log('[API] Loading market participants from Supabase...');

    // Supabase has a default limit of 1000 rows, so we need to explicitly set a higher limit
    // or use pagination. For now, we'll set a high limit to get all companies.
    const { data, error } = await supabase
      .from('market_participants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10000); // Increased limit to accommodate growing database

    if (error) {
      console.error('[API] Supabase error:', error);
      return res.status(500).json({ 
        error: 'Database error',
        details: error.message,
        participants: []
      });
    }

    console.log(`[API] Successfully loaded ${data?.length || 0} participants`);

    // Set cache headers (cache for 5 minutes)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json({
      success: true,
      count: data?.length || 0,
      participants: data || []
    });

  } catch (error: any) {
    console.error('[API] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      participants: []
    });
  }
}
