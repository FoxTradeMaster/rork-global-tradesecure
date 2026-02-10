import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

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

    console.log(`[API] Loading market participants page ${page} (limit: ${limit})...`);

    // Get total count first
    const { count: totalCount } = await supabase
      .from('market_participants')
      .select('*', { count: 'exact', head: true });

    // Fetch paginated data (limit to 1000 total to prevent browser crashes)
    const maxRows = 1000;
    const actualEndIndex = Math.min(endIndex, maxRows - 1);
    
    const { data, error } = await supabase
      .from('market_participants')
      .select('*')
      .order('created_at', { ascending: false })
      .range(startIndex, actualEndIndex);

    if (error) {
      console.error('[API] Supabase error:', error);
      return res.status(500).json({ 
        error: 'Database error',
        details: error.message,
        participants: []
      });
    }

    console.log(`[API] Successfully loaded ${data?.length || 0} participants (page ${page} of ${Math.ceil((totalCount || 0) / limit)})`);

    // Set cache headers (cache for 5 minutes)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json({
      success: true,
      page,
      limit,
      total: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / limit),
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
