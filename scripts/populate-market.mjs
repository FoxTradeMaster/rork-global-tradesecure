#!/usr/bin/env node

/**
 * Autonomous Market Directory Updater
 * 
 * Populates the Global TradeSecure market directory with verified companies
 * using OpenAI for discovery and BrandFetch for verification.
 * 
 * Usage:
 *   node populate-market.mjs --commodity iron_ore --count 50
 *   node populate-market.mjs --build-all --target 50
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Environment variables are passed directly from GitHub Actions or shell environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Configuration
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

// Initialize clients
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Generate company names using OpenAI
 */
async function generateCompanyNames(commodity, count) {
  console.log(`🤖 Generating ${count} ${commodity} companies using AI...`);
  
  const prompt = `Generate a list of ${count} real, verified companies that operate in the ${COMMODITIES[commodity]} industry. 
Include companies from different regions (North America, Europe, Asia, Africa, South America, Australia).
Return ONLY a JSON array of company names, nothing else.
Format: ["Company Name 1", "Company Name 2", ...]`;

  try {
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
  } catch (error) {
    console.error('❌ Error generating companies:', error.message);
    throw error;
  }
}

/**
 * Verify company with BrandFetch
 */
async function verifyWithBrandFetch(companyName) {
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
          'Authorization': `Bearer ${BRANDFETCH_API_KEY}`,
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
          'Authorization': `Bearer ${BRANDFETCH_API_KEY}`,
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
async function addCompanyToDatabase(companyData, commodity) {
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
        name: companyData.name,type: 'company',
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
async function updateSingleCommodity(commodity, targetCount) {
  console.log(`\n📦 Running updater for ${commodity} (target: ${targetCount} companies)\n`);

  const stats = {
    generated: 0,
    verified: 0,
    added: 0,
    skipped: 0,
    failed: 0,
  };

  // Generate company names
  const companyNames = await generateCompanyNames(commodity, targetCount);
  stats.generated += companyNames.length;

  // Process each company
  for (const companyName of companyNames) {
    console.log(`\n🔍 Processing: ${companyName}`);

    // Verify with BrandFetch
    const brandData = await verifyWithBrandFetch(companyName);

    if (brandData) {
      stats.verified++;
      
      // Add to database
      const result = await addCompanyToDatabase(brandData, commodity);
      
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
      
      const result = await addCompanyToDatabase(fallbackData, commodity);
      
      if (result.success) {
        stats.added++;
      } else {
        stats.failed++;
      }
    }

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return stats;
}

/**
 * Main update function - supports both single commodity and build-all modes
 */
async function updateMarketDirectory(options) {
  const { buildAll, commodity, targetCount } = options;
  
  console.log(`\n🚀 Starting Autonomous Market Directory Update`);
  
  if (buildAll) {
    const commodityList = Object.keys(COMMODITIES);
    console.log(`📊 Target: ${targetCount} companies per commodity (${targetCount * commodityList.length} total)\n`);
    console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
    
    const allStats = {
      generated: 0,
      verified: 0,
      added: 0,
      skipped: 0,
      failed: 0,
    };

    // Process all commodities
    for (const comm of commodityList) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📦 Processing commodity: ${comm.toUpperCase()} (${COMMODITIES[comm]})`);
      console.log(`${'='.repeat(60)}\n`);
      
      const stats = await updateSingleCommodity(comm, targetCount);
      
      // Aggregate stats
      allStats.generated += stats.generated;
      allStats.verified += stats.verified;
      allStats.added += stats.added;
      allStats.skipped += stats.skipped;
      allStats.failed += stats.failed;
      
      console.log(`\n✅ ${comm} Complete!`);
      console.log(`   Generated: ${stats.generated} | Verified: ${stats.verified} | Added: ${stats.added} | Skipped: ${stats.skipped} | Failed: ${stats.failed}`);
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`🎉 ALL COMMODITIES COMPLETE!`);
    console.log(`${'='.repeat(60)}\n`);
    console.log(`📊 Final Statistics:`);
    console.log(`   Generated: ${allStats.generated} companies`);
    console.log(`   Verified: ${allStats.verified} companies`);
    console.log(`   Added: ${allStats.added} companies`);
    console.log(`   Skipped: ${allStats.skipped} companies (duplicates)`);
    console.log(`   Failed: ${allStats.failed} companies`);
    console.log(`\n⏰ Completed at: ${new Date().toISOString()}\n`);

    return allStats;
  } else {
    // Single commodity mode
    console.log(`📊 Target: ${targetCount} companies for ${commodity}\n`);
    console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
    
    const stats = await updateSingleCommodity(commodity, targetCount);
    
    console.log(`\n\n✅ Update Complete!`);
    console.log(`\n📊 Final Statistics:`);
    console.log(`   Generated: ${stats.generated} companies`);
    console.log(`   Verified: ${stats.verified} companies`);
    console.log(`   Added: ${stats.added} companies`);
    console.log(`   Skipped: ${stats.skipped} companies (duplicates)`);
    console.log(`   Failed: ${stats.failed} companies`);
    console.log(`\n⏰ Completed at: ${new Date().toISOString()}\n`);

    return stats;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const buildAllFlag = args.includes('--build-all');
const commodityArg = args.find(arg => arg.startsWith('--commodity='));
const countArg = args.find(arg => arg.startsWith('--count=')) || args.find(arg => arg.startsWith('--target='));

const commodity = commodityArg ? commodityArg.split('=')[1] : 'gold';
const count = countArg ? parseInt(countArg.split('=')[1]) : 50;

// Run the updater
updateMarketDirectory({
  buildAll: buildAllFlag,
  commodity: commodity,
  targetCount: count,
})
  .then(() => {
    console.log('✅ Autonomous updater completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Autonomous updater failed:', error);
    process.exit(1);
  });
