// api/generate-companies.js
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Commodity mappings
const COMMODITIES = {
  gold: 'Gold Mining',
  fuel_oil: 'Fuel Oil Trading',
  steam_coal: 'Steam Coal',
  anthracite_coal: 'Anthracite Coal',
  urea: 'Urea/Fertilizer',
  edible_oils: 'Edible Oils',
  bio_fuels: 'Bio-Fuels',
  iron_ore: 'Iron Ore',
};

/**
 * Generate company names using OpenAI
 */
async function generateCompanyNames(openai, commodity, count) {
  console.log(`🤖 Generating ${count} ${commodity} companies using AI...`);
  
  const prompt = `Generate a list of ${count} real, verified SMALLER and NICHE companies that operate in the ${COMMODITIES[commodity]} industry.
Focus on:
- Mid-sized regional players (not Fortune 500 or global giants)
- Emerging companies and startups in the sector
- Specialized niche operators
- Lesser-known but legitimate companies
- Companies from diverse regions (North America, Europe, Asia, Africa, South America, Australia)

AVOID major multinational corporations and industry leaders.
Return ONLY a JSON array of company names, nothing else.
Format: ["Company Name 1", "Company Name 2", ...]`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  const content = response.choices[0].message.content.trim();
  
  // Remove markdown code blocks if present
  const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const companies = JSON.parse(jsonContent);
  console.log(`✅ Generated ${companies.length} company names`);
  return companies;
}

/**
 * Verify company with BrandFetch
 */
async function verifyWithBrandFetch(companyName, brandfetchApiKey) {
  try {
    // Normalize company name for search
    const searchName = companyName
      .replace(/\s+(Inc\.|LLC|Ltd\.|Limited|Corp\.|Corporation|S\.A\.|AG|GmbH|PLC)/gi, '')
      .trim();

    // Search for company
    const searchResponse = await fetch(
      `https://api.brandfetch.io/v2/search/${encodeURIComponent(searchName)}`,
      {
        headers: {
          'Authorization': `Bearer ${brandfetchApiKey}`,
        },
      }
    );

    if (!searchResponse.ok) {
      return null;
    }

    const searchData = await searchResponse.json();
    
    if (!searchData || searchData.length === 0) {
      return null;
    }

    // Get the first result's domain
    const domain = searchData[0].domain;

    // Get full brand data
    const brandResponse = await fetch(
      `https://api.brandfetch.io/v2/brands/${domain}`,
      {
        headers: {
          'Authorization': `Bearer ${brandfetchApiKey}`,
        },
      }
    );

    if (!brandResponse.ok) {
      // Return basic data from search if brand fetch fails
      return {
        name: searchData[0].name || companyName,
        domain: domain,
        logo: searchData[0].icon || null,
        description: null,
        website: `https://${domain}`,
      };
    }

    const brandData = await brandResponse.json();

    return {
      name: brandData.name || companyName,
      domain: domain,
      logo: brandData.logos?.[0]?.formats?.[0]?.src || brandData.icon || null,
      description: brandData.description || null,
      website: `https://${domain}`,
    };
  } catch (error) {
    console.error(`⚠️  BrandFetch error for ${companyName}:`, error.message);
    return null;
  }
}

/**
 * Add company to database
 */
async function addCompanyToDatabase(supabase, companyData, commodity) {
  try {
    // Check if company already exists by domain
    if (companyData.domain) {
      const { data: existing } = await supabase
        .from('market_participants')
        .select('id')
        .eq('domain', companyData.domain)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped: ${companyData.name} (domain already exists)`);
        return { success: false, reason: 'duplicate' };
      }
    }

    // Calculate quality score
    let qualityScore = 0;
    if (companyData.name) qualityScore += 20;
    if (companyData.domain) qualityScore += 20;
    if (companyData.logo) qualityScore += 20;
    if (companyData.description) qualityScore += 20;
    if (companyData.website) qualityScore += 20;

    // Insert company
    const { data, error } = await supabase
      .from('market_participants')
      .insert({
        name: companyData.name,
        type: 'company',
        commodities: [commodity],
        logo: companyData.logo,
        description: companyData.description,
        website: companyData.website,
        domain: companyData.domain,
        data_quality_score: qualityScore,
        brandfetch_verified: companyData.domain ? true : false,
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Database error for ${companyData.name}:`, error.message);
      return { success: false, reason: 'database_error', error };
    }

    console.log(`✅ Added: ${companyData.name} (quality: ${qualityScore}%)`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Error adding ${companyData.name}:`, error.message);
    return { success: false, reason: 'exception', error };
  }
}

/**
 * Update market directory for a single commodity
 */
async function updateSingleCommodity(openai, supabase, brandfetchApiKey, commodity, targetCount) {
  console.log(`\n📦 Running updater for ${commodity} (target: ${targetCount} companies)\n`);

  const stats = {
    generated: 0,
    verified: 0,
    added: 0,
    skipped: 0,
    failed: 0,
  };

  // Generate company names
  const companyNames = await generateCompanyNames(openai, commodity, targetCount);
  stats.generated += companyNames.length;

  // Process each company
  for (const companyName of companyNames) {
    console.log(`\n🔍 Processing: ${companyName}`);

    // Verify with BrandFetch
    const brandData = await verifyWithBrandFetch(companyName, brandfetchApiKey);

    if (brandData) {
      stats.verified++;
      
      // Add to database
      const result = await addCompanyToDatabase(supabase, brandData, commodity);
      
      if (result.success) {
        stats.added++;
      } else if (result.reason === 'duplicate') {
        stats.skipped++;
      } else {
        stats.failed++;
      }
    } else {
      // Add with minimal data if BrandFetch fails
      const fallbackData = {
        name: companyName,
        domain: null,
        logo: null,
        description: null,
        website: null,
      };
      
      const result = await addCompanyToDatabase(supabase, fallbackData, commodity);
      
      if (result.success) {
        stats.added++;
      } else {
        stats.failed++;
      }
    }

    // Rate limiting delay (reduced for serverless)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return stats;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify required environment variables
    const requiredEnvVars = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      BRANDFETCH_API_KEY: process.env.BRANDFETCH_API_KEY,
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return res.status(500).json({ 
        error: 'Missing required environment variables',
        missing: missingVars
      });
    }

    // Get request parameters
    const { commodity = 'gold', count = 10 } = req.body;

    console.log(`[Autonomous Updater] Starting generation: ${count} ${commodity} companies`);

    // Initialize clients
    const openai = new OpenAI({
      apiKey: requiredEnvVars.OPENAI_API_KEY,
    });

    const supabase = createClient(
      requiredEnvVars.EXPO_PUBLIC_SUPABASE_URL,
      requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY
    );

    // Run the update
    const stats = await updateSingleCommodity(
      openai,
      supabase,
      requiredEnvVars.BRANDFETCH_API_KEY,
      commodity,
      count
    );

    console.log('[Autonomous Updater] Complete:', stats);

    return res.status(200).json({
      success: true,
      message: `Successfully generated and saved ${stats.added} companies with Brandfetch verification`,
      commodity,
      requested: count,
      stats: stats,
    });

  } catch (error) {
    console.error('[Autonomous Updater] Error:', error);

    return res.status(500).json({ 
      error: 'Failed to generate companies',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
