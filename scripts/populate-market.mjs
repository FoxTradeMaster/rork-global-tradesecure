#!/usr/bin/env node

/**
 * Autonomous Market Directory Updater
 * 
 * Populates the Global TradeSecure market directory with verified companies
 * using OpenAI for discovery and BrandFetch for verification.
 * 
 * Usage:
 *   node populate-market.js --commodity iron_ore --count 50
 *   node populate-market.js --build-all --target 500
 *   node populate-market.js --auto --daily
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

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

const BATCH_SIZE = 10; // Companies per AI request
const RATE_LIMIT_DELAY = 1500; // ms between BrandFetch requests

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const brandfetchApiKey = process.env.BRANDFETCH_API_KEY;

// BrandFetch Client
class BrandFetchClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.brandfetch.io/v2';
  }

  async searchByName(name) {
    try {
      const response = await fetch(`${this.baseUrl}/search/${encodeURIComponent(name)}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`BrandFetch search error for ${name}:`, error.message);
      return null;
    }
  }

  async searchByDomain(domain) {
    try {
      const response = await fetch(`${this.baseUrl}/brands/${domain}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`BrandFetch domain error for ${domain}:`, error.message);
      return null;
    }
  }

  getLogo(brandData) {
    if (!brandData.logos || brandData.logos.length === 0) return null;
    const logo = brandData.logos.find(l => l.type === 'logo') || brandData.logos[0];
    return logo.formats?.[0]?.src || null;
  }

  getPrimaryColor(brandData) {
    if (!brandData.colors || brandData.colors.length === 0) return null;
    return brandData.colors[0]?.hex || null;
  }
}

// Generate companies using OpenAI
async function generateCompanies(commodity, count) {
  const commodityLabel = COMMODITIES[commodity];
  
  console.log(`🤖 Generating ${count} ${commodityLabel} companies using AI...`);
  
  const prompt = `List ${count} well-known, REAL companies that operate in the ${commodityLabel} market.

Provide only:
- Exact company name (as it appears publicly)
- Company type (Trading Company, Refinery, Distributor, Mining Company, Producer, etc.)
- Primary region (Asia, Europe, Americas, Middle East, Africa)

These will be looked up in BrandFetch to get verified business data, logos, and contact information.
Only include major, established companies that would have a public brand presence.
Focus on diverse companies from different regions.

Respond with valid JSON only: {"companies": [{"name": "...", "type": "...", "region": "..."}]}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business research assistant. Generate accurate, real company names in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    // Remove markdown code blocks if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanContent);
    console.log(`✓ Generated ${parsed.companies.length} companies`);
    return parsed.companies || [];
  } catch (error) {
    console.error('❌ OpenAI generation error:', error.message);
    throw error;
  }
}

// Normalize company name for better search results
function normalizeCompanyName(name) {
  return name
    .replace(/\s+(S\.A\.|Inc\.|Ltd\.|LLC|Corp\.|Corporation|Limited|Group|PLC|AG)$/i, '')
    .trim();
}

// Verify and enrich company with BrandFetch
async function enrichCompany(company, commodity, brandfetch) {
  try {
    const originalName = company.name;
    const normalizedName = normalizeCompanyName(company.name);
    
    console.log(`  🔍 Searching: ${originalName}`);
    
    // Try original name first, then normalized
    let searchResults = await brandfetch.searchByName(originalName);
    if (!searchResults || searchResults.length === 0) {
      console.log(`  🔄 Trying normalized name: ${normalizedName}`);
      searchResults = await brandfetch.searchByName(normalizedName);
    }
    
    if (!searchResults || searchResults.length === 0) {
      console.log(`  ⚠️  No BrandFetch results for: ${originalName}`);
      return null;
    }

    const bestMatch = searchResults[0];
    if (!bestMatch.domain) {
      console.log(`  ⚠️  No domain found for: ${company.name}`);
      return null;
    }

    const brandData = await brandfetch.searchByDomain(bestMatch.domain);
    if (!brandData) {
      console.log(`  ⚠️  No full brand data for: ${bestMatch.domain}, using basic info`);
      // Fallback: use basic search result data
      return {
        name: bestMatch.name || originalName,
        type: company.type,
        headquarters: company.region,
        description: `${company.type} operating in ${commodity.replace(/_/g, ' ')} sector`,
        verified: false,
        website: `https://${bestMatch.domain}`,
        commodities: [commodity],
        category: [company.type],
        logo: bestMatch.icon || null,
        brand_color: null,
        email: null,
        domain: bestMatch.domain,
        data_quality_score: 40,
        last_verified: new Date().toISOString(),
      };
    }

    const logo = brandfetch.getLogo(brandData);
    const brandColor = brandfetch.getPrimaryColor(brandData);
    const website = brandData.links?.find(l => l.name === 'website')?.url || `https://${brandData.domain}`;
    const email = brandData.links?.find(l => l.name === 'email')?.url?.replace('mailto:', '');

    // Calculate quality score
    let qualityScore = 0;
    if (brandData.name) qualityScore += 20;
    if (brandData.description) qualityScore += 20;
    if (logo) qualityScore += 20;
    if (website) qualityScore += 15;
    if (brandData.links && brandData.links.length > 0) qualityScore += 15;
    if (brandData.claimed) qualityScore += 10;

    console.log(`  ✓ Enriched: ${brandData.name} (Quality: ${qualityScore}/100)`);

    return {
      name: brandData.name || company.name,
      type: company.type,
      headquarters: company.region,
      description: brandData.description || brandData.longDescription || `${company.type} operating in ${commodity.replace(/_/g, ' ')} sector`,
      verified: true,
      website,
      commodities: [commodity],
      category: [company.type],
      logo,
      brand_color: brandColor,
      email,
      domain: brandData.domain,
      data_quality_score: qualityScore,
      last_verified: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`  ❌ Error enriching ${company.name}:`, error.message);
    return null;
  }
}

// Check for duplicates
async function getExistingCompanies() {
  const { data } = await supabase
    .from('market_participants')
    .select('name, domain');
  
  return {
    names: new Set(data?.map(c => c.name.toLowerCase()) || []),
    domains: new Set(data?.map(c => c.domain) || []),
  };
}

// Save companies to database
async function saveCompanies(companies) {
  if (companies.length === 0) return 0;

  const { data, error } = await supabase
    .from('market_participants')
    .insert(companies)
    .select();

  if (error) {
    console.error('❌ Database error:', error.message);
    return 0;
  }

  return data?.length || 0;
}

// Main update function
async function updateMarket(commodity, targetCount) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Autonomous Market Updater - ${COMMODITIES[commodity]}`);
  console.log(`🎯 Target: ${targetCount} companies`);
  console.log(`${'='.repeat(60)}\n`);

  const brandfetch = new BrandFetchClient(brandfetchApiKey);
  let totalAdded = 0;
  let totalAttempted = 0;
  let duplicates = 0;

  while (totalAdded < targetCount) {
    const remaining = targetCount - totalAdded;
    const batchSize = Math.min(BATCH_SIZE, remaining);

    console.log(`\n📦 Batch ${Math.floor(totalAttempted / BATCH_SIZE) + 1}: Generating ${batchSize} companies...`);

    // Generate companies
    const companyTemplates = await generateCompanies(commodity, batchSize);
    totalAttempted += companyTemplates.length;

    // Get existing companies
    const existing = await getExistingCompanies();

    // Enrich companies
    const enrichedCompanies = [];
    for (const template of companyTemplates) {
      // Check duplicates
      if (existing.names.has(template.name.toLowerCase())) {
        console.log(`  ⏭️  Skipping duplicate: ${template.name}`);
        duplicates++;
        continue;
      }

      const enriched = await enrichCompany(template, commodity, brandfetch);
      
      if (enriched) {
        // Check domain duplicate
        if (existing.domains.has(enriched.domain)) {
          console.log(`  ⏭️  Domain already exists: ${enriched.domain}`);
          duplicates++;
          continue;
        }

        enrichedCompanies.push(enriched);
        existing.domains.add(enriched.domain);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }

    // Save to database
    if (enrichedCompanies.length > 0) {
      const saved = await saveCompanies(enrichedCompanies);
      totalAdded += saved;
      console.log(`\n✅ Saved ${saved} companies to database`);
    }

    console.log(`\n📈 Progress: ${totalAdded}/${targetCount} companies added`);

    if (enrichedCompanies.length === 0 && duplicates > 0) {
      console.log(`\n⚠️  All companies in this batch were duplicates. Trying again...`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ COMPLETE!`);
  console.log(`   Added: ${totalAdded} companies`);
  console.log(`   Attempted: ${totalAttempted} companies`);
  console.log(`   Duplicates: ${duplicates}`);
  console.log(`   Success Rate: ${Math.round((totalAdded / totalAttempted) * 100)}%`);
  console.log(`${'='.repeat(60)}\n`);
}

// Build entire directory
async function buildAll(targetPerCommodity) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏗️  BUILDING COMPLETE MARKET DIRECTORY`);
  console.log(`🎯 Target: ${targetPerCommodity} companies per commodity`);
  console.log(`📊 Total: ${targetPerCommodity * Object.keys(COMMODITIES).length} companies`);
  console.log(`${'='.repeat(60)}\n`);

  for (const [commodity, label] of Object.entries(COMMODITIES)) {
    await updateMarket(commodity, targetPerCommodity);
    console.log(`\n⏸️  Pausing 10 seconds before next commodity...\n`);
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  console.log(`\n${'🎉'.repeat(30)}`);
  console.log(`✅ DIRECTORY BUILD COMPLETE!`);
  console.log(`${'🎉'.repeat(30)}\n`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    commodity: null,
    count: 10,
    buildAll: false,
    target: 100,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--commodity':
        options.commodity = args[++i];
        break;
      case '--count':
        options.count = parseInt(args[++i]);
        break;
      case '--build-all':
        options.buildAll = true;
        break;
      case '--target':
        options.target = parseInt(args[++i]);
        break;
      case '--help':
        console.log(`
Autonomous Market Directory Updater

Usage:
  node populate-market.js --commodity <name> --count <number>
  node populate-market.js --build-all --target <number>

Options:
  --commodity <name>   Commodity to update (${Object.keys(COMMODITIES).join(', ')})
  --count <number>     Number of companies to add (default: 10)
  --build-all          Build entire directory across all commodities
  --target <number>    Target companies per commodity for --build-all (default: 100)
  --help               Show this help message

Examples:
  node populate-market.js --commodity iron_ore --count 50
  node populate-market.js --build-all --target 500
        `);
        process.exit(0);
    }
  }

  return options;
}

// Main
async function main() {
  const options = parseArgs();

  // Validate environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment');
    process.exit(1);
  }
  if (!process.env.BRANDFETCH_API_KEY) {
    console.error('❌ Error: BRANDFETCH_API_KEY not found in environment');
    process.exit(1);
  }
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: Supabase credentials not found in environment');
    process.exit(1);
  }

  try {
    if (options.buildAll) {
      await buildAll(options.target);
    } else {
      if (!options.commodity) {
        console.error('❌ Error: --commodity required (or use --build-all)');
        console.log('Available commodities:', Object.keys(COMMODITIES).join(', '));
        process.exit(1);
      }
      if (!COMMODITIES[options.commodity]) {
        console.error(`❌ Error: Invalid commodity "${options.commodity}"`);
        console.log('Available commodities:', Object.keys(COMMODITIES).join(', '));
        process.exit(1);
      }
      await updateMarket(options.commodity, options.count);
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
