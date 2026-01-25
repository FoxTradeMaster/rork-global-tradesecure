# Global TradeSecure - Autonomous Market Updater System

**Complete Documentation & User Guide**  
*Last Updated: January 24, 2026*

---

## 🎯 System Overview

The Autonomous Market Updater is a fully automated system that generates, verifies, and adds companies to your Global TradeSecure market directory **24/7 without manual intervention**.

### Key Features

✅ **Automatic Daily Updates** - Runs once every 24 hours at 2 AM UTC  
✅ **AI-Powered Generation** - Uses OpenAI GPT-4 to discover real companies  
✅ **Brandfetch Verification** - Verifies and enriches each company with official data  
✅ **Multi-Commodity Support** - Covers 8 commodity sectors simultaneously  
✅ **Cloud Database Sync** - Saves directly to Supabase (syncs across all devices)  
✅ **Manual Trigger** - Click "Update Now" button in app anytime  

---

## 📊 Daily Update Capacity

**Total: 400 companies per day**

| Commodity | Companies/Day |
|-----------|---------------|
| Gold | 50 |
| Fuel Oil | 50 |
| Steam Coal | 50 |
| Anthracite Coal | 50 |
| Urea/Fertilizer | 50 |
| Edible Oils | 50 |
| Bio-Fuels | 50 |
| Iron Ore | 50 |

**Monthly Capacity:** ~12,000 companies  
**Yearly Capacity:** ~146,000 companies

---

## 🔧 System Architecture

### Components

1. **Frontend (React Native App)**
   - Settings screen with "Update Now" button
   - Real-time status display
   - Update logs and history
   - Located: `/app/(tabs)/settings.tsx`

2. **API Endpoint**
   - Serverless function on Vercel
   - Receives requests from app
   - Executes populate-market script
   - Located: `/api/generate-companies.js`

3. **Populate Market Script**
   - Core generation logic
   - OpenAI integration for company discovery
   - Brandfetch API for verification
   - Supabase database operations
   - Located: `/scripts/populate-market.mjs`

4. **GitHub Actions Workflow**
   - Scheduled automation (daily at 2 AM UTC)
   - Manual trigger capability
   - Environment variable management
   - Located: `/.github/workflows/autonomous-updater.yml`

5. **Supabase Database**
   - Cloud PostgreSQL database
   - Table: `market_participants`
   - Row Level Security (RLS) enabled
   - Public policies for INSERT/SELECT/UPDATE

---

## 🚀 How It Works

### Automatic Mode (24/7 Operation)

```
Every 24 hours at 2 AM UTC:
1. GitHub Actions triggers workflow
2. For each commodity (8 total):
   a. OpenAI generates 50 real company names
   b. Brandfetch verifies each company
   c. Fetches: logo, brand colors, website, description
   d. Saves to Supabase with quality score
   e. 3-second delay between commodities (rate limiting)
3. Updates complete
4. Summary logged to GitHub Actions
```

### Manual Mode (On-Demand)

```
User clicks "Update Now" button:
1. App calls /api/generate-companies
2. API executes populate-market.mjs script
3. Generates companies for selected commodity
4. Returns success/failure to app
5. App displays results
```

---

## 🔑 Required Environment Variables

### Vercel (for API endpoint)

```
OPENAI_API_KEY=sk-...
BRANDFETCH_API_KEY=...
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### GitHub Secrets (for scheduled automation)

Same as above, configured at:  
`https://github.com/FoxTradeMaster/rork-global-tradesecure/settings/secrets/actions`

---

## 📱 Using the App Interface

### Accessing Autonomous Updater

1. Open Global TradeSecure app
2. Navigate to **Settings** tab (bottom navigation)
3. Scroll to **"Autonomous Market Updates"** section

### Understanding the Interface

**Status Indicators:**
- 🟢 Green dot = System enabled and running
- ⚫ Gray dot = System disabled

**Controls:**
- **Enable/Disable Toggle** - Turn automation on/off
- **Pause/Resume Button** - Temporarily pause without disabling
- **Update Now Button** - Trigger immediate update

**Statistics:**
- **Companies/Update** - Number generated per commodity (default: 10)
- **Update Interval** - Hours between automatic updates (default: 24h)
- **Last Update** - Timestamp of most recent update
- **Next Update** - Countdown to next scheduled update

### Update Logs

Click **"View Logs"** to see:
- Timestamp of each update
- Commodity processed
- Companies added
- Success/failure status
- Quality scores
- Brandfetch verification results

---

## 🛠️ Configuration Options

### Adjusting Update Frequency

**Default:** Once every 24 hours  
**Recommended:** Keep at 24h to respect API rate limits

To change:
1. Open app → Settings
2. Find "Update Interval" setting
3. Adjust hours (minimum: 24h recommended)

### Adjusting Companies Per Update

**Default:** 10 companies per commodity  
**Maximum:** 50 companies per commodity (API limit)

To change:
1. Open app → Settings
2. Find "Companies/Update" setting
3. Adjust number (10-50 range)

### Selecting Commodities

**Default:** All 8 commodities enabled

To customize:
1. Open app → Settings
2. Find "Selected Commodities" section
3. Toggle commodities on/off

---

## 🔍 Data Quality & Verification

### Brandfetch Verification Process

For each company:
1. **Search** - Query Brandfetch API by company name
2. **Domain Extraction** - Get official website domain
3. **Brand Data Fetch** - Retrieve full brand profile
4. **Quality Scoring** - Calculate data completeness (0-100%)

### Data Fields Collected

**Basic Information:**
- Company name
- Headquarters location
- Description
- Website URL
- Domain

**Brand Assets:**
- Logo (high resolution)
- Brand colors (primary/secondary)
- Social media links

**Verification Status:**
- `brandfetch_verified: true/false`
- `data_quality_score: 0-100`

### Quality Thresholds

- **90-100%** - Excellent (full data, verified logo)
- **70-89%** - Good (most data, verified)
- **50-69%** - Fair (basic data, some missing)
- **Below 50%** - Poor (minimal data, may skip)

---

## 📈 Monitoring & Troubleshooting

### Checking System Status

**In the App:**
1. Settings → Autonomous Market Updates
2. Check status dot (green = active)
3. View "Last Update" timestamp
4. Review logs for recent activity

**On GitHub:**
1. Go to: `https://github.com/FoxTradeMaster/rork-global-tradesecure/actions`
2. Click "Autonomous Market Directory Updater"
3. View recent workflow runs
4. Check success/failure status

**In Supabase:**
1. Open Supabase dashboard
2. Go to Table Editor → `market_participants`
3. Check row count (should increase daily)
4. Filter by `created_at` to see recent additions

### Common Issues & Solutions

#### Issue: "Update Now" button not working

**Symptoms:** Button shows loading but nothing happens

**Solutions:**
1. Check internet connection
2. Verify Vercel deployment is live
3. Check browser console for errors
4. Ensure environment variables are set in Vercel

#### Issue: No companies being added

**Symptoms:** Update completes but Supabase count unchanged

**Solutions:**
1. Check GitHub Actions logs for errors
2. Verify all 4 environment variables are set
3. Check Supabase RLS policies are enabled
4. Verify API keys are valid (not expired)

#### Issue: Duplicate companies

**Symptoms:** Same companies appearing multiple times

**Solutions:**
- System has built-in duplicate detection
- Checks company name + domain before inserting
- If duplicates appear, check database constraints

#### Issue: Low quality data

**Symptoms:** Companies with missing logos/info

**Solutions:**
1. Check Brandfetch API key is valid
2. Verify Brandfetch API quota not exceeded
3. Adjust quality threshold in script
4. Some companies may have limited public data

---

## 🔐 Security & Best Practices

### API Key Management

**DO:**
✅ Store keys in environment variables only
✅ Use different keys for dev/production
✅ Rotate keys periodically (every 90 days)
✅ Monitor API usage/quotas

**DON'T:**
❌ Commit keys to Git repository
❌ Share keys in chat/email
❌ Use production keys in development
❌ Expose keys in client-side code

### Rate Limiting

**OpenAI API:**
- Limit: 60 requests/minute (GPT-4)
- Script includes 3-second delays between commodities
- Daily limit: ~10,000 tokens

**Brandfetch API:**
- Limit: 100 requests/month (free tier)
- Upgrade to paid plan for higher limits
- Script respects rate limits automatically

**Supabase:**
- Free tier: 500MB database
- Unlimited API requests
- Row Level Security enabled

### Database Security

**Row Level Security (RLS):**
- Enabled on `market_participants` table
- Public policies allow INSERT/SELECT/UPDATE
- Service role key bypasses RLS (server-side only)
- Anon key respects RLS (client-side)

**Policies:**
```sql
-- Allow public insert
CREATE POLICY "Allow public insert" 
ON market_participants 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public select
CREATE POLICY "Allow public select" 
ON market_participants 
FOR SELECT 
TO public 
USING (true);

-- Allow public update
CREATE POLICY "Allow public update" 
ON market_participants 
FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);
```

---

## 📊 Database Schema

### `market_participants` Table

```sql
CREATE TABLE public.market_participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  headquarters TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT false,
  website TEXT,
  domain TEXT,
  commodities TEXT[],
  category TEXT[],
  offices TEXT[],
  licenses TEXT[],
  specialization TEXT,
  business_type TEXT,
  logo TEXT,
  brand_color TEXT,
  email TEXT,
  contact_links JSONB,
  founded TEXT,
  trading_volume TEXT,
  broker_type TEXT[],
  regulated_by TEXT[],
  clearing_relationships TEXT[],
  license_numbers TEXT[],
  framework TEXT,
  members INTEGER,
  data_quality_score INTEGER,
  brandfetch_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_market_participants_type ON market_participants(type);
CREATE INDEX idx_market_participants_commodities ON market_participants USING GIN(commodities);
CREATE INDEX idx_market_participants_verified ON market_participants(verified);
CREATE INDEX idx_market_participants_created_at ON market_participants(created_at);
```

---

## 🔄 Manual Script Execution

### Running Locally

```bash
# Install dependencies
pnpm install

# Set environment variables
export OPENAI_API_KEY="sk-..."
export BRANDFETCH_API_KEY="..."
export EXPO_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Run for single commodity
node scripts/populate-market.mjs --commodity gold --count 50

# Run for all commodities
bash scripts/run-updater.sh gold 50
bash scripts/run-updater.sh fuel_oil 50
# ... repeat for each commodity
```

### Command Line Options

```bash
node scripts/populate-market.mjs [options]

Options:
  --commodity <name>   Commodity to generate companies for
                       (gold, fuel_oil, steam_coal, anthracite_coal,
                        urea, edible_oils, bio_fuels, iron_ore)
  
  --count <number>     Number of companies to generate (default: 10)
  
  --build-all          Generate companies for all commodities
  
  --target <number>    Total target when using --build-all
```

### Examples

```bash
# Generate 25 gold companies
node scripts/populate-market.mjs --commodity gold --count 25

# Generate 500 companies across all commodities
node scripts/populate-market.mjs --build-all --target 500

# Run via helper script
bash scripts/run-updater.sh iron_ore 30
```

---

## 📅 Maintenance Schedule

### Daily
- ✅ Automatic updates run at 2 AM UTC
- ✅ System logs generated
- ✅ Companies added to database

### Weekly
- Check GitHub Actions for failures
- Review update logs in app
- Verify Supabase row count increasing

### Monthly
- Review API usage/quotas
- Check data quality scores
- Remove duplicate entries (if any)
- Verify all environment variables valid

### Quarterly
- Rotate API keys
- Review and optimize commodity selection
- Analyze company distribution by sector
- Update documentation if needed

---

## 🎓 Advanced Configuration

### Customizing Company Generation

Edit `/scripts/populate-market.mjs`:

```javascript
// Line 48-50: Adjust AI prompt
const prompt = `Generate a list of ${count} real, verified companies...`;

// Line 78-95: Modify Brandfetch search logic
const searchResponse = await fetch(
  `https://api.brandfetch.io/v2/search/${encodeURIComponent(searchName)}`,
  ...
);

// Line 171-184: Customize database insert
const { data, error } = await supabase
  .from('market_participants')
  .insert({...})
  .select()
  .single();
```

### Adjusting GitHub Actions Schedule

Edit `/.github/workflows/autonomous-updater.yml`:

```yaml
on:
  schedule:
    # Change cron expression
    # Format: minute hour day month weekday
    - cron: '0 2 * * *'  # 2 AM UTC daily
    
    # Examples:
    # '0 */6 * * *'   # Every 6 hours
    # '0 0 * * 0'     # Weekly on Sunday
    # '0 0 1 * *'     # Monthly on 1st
```

### Modifying API Endpoint

Edit `/api/generate-companies.js`:

```javascript
// Line 44: Change default parameters
const { commodity = 'gold', count = 10 } = req.body;

// Line 76: Adjust timeout
timeout: 300000, // 5 minutes (in milliseconds)

// Line 78: Increase buffer size
maxBuffer: 1024 * 1024 * 10, // 10MB
```

---

## 📞 Support & Resources

### Documentation
- **This Guide:** Complete system documentation
- **GitHub README:** https://github.com/FoxTradeMaster/rork-global-tradesecure
- **Supabase Docs:** https://supabase.com/docs

### API Documentation
- **OpenAI API:** https://platform.openai.com/docs
- **Brandfetch API:** https://docs.brandfetch.com
- **Supabase API:** https://supabase.com/docs/reference/javascript

### Monitoring Links
- **GitHub Actions:** https://github.com/FoxTradeMaster/rork-global-tradesecure/actions
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## ✅ System Status Checklist

Use this checklist to verify everything is working:

### Environment Setup
- [ ] Vercel environment variables configured
- [ ] GitHub Secrets configured
- [ ] Supabase RLS policies enabled
- [ ] API keys valid and not expired

### Functionality
- [ ] "Update Now" button works in app
- [ ] Manual trigger generates companies
- [ ] Companies appear in Supabase
- [ ] Data syncs across devices (iPad/Android)
- [ ] GitHub Actions runs daily

### Data Quality
- [ ] Companies have Brandfetch verification
- [ ] Logos and brand colors populated
- [ ] Quality scores above 70%
- [ ] No duplicate entries

### Monitoring
- [ ] GitHub Actions shows recent successful runs
- [ ] Supabase row count increasing daily
- [ ] Update logs visible in app
- [ ] No error messages in logs

---

## 🎉 Success Metrics

**System is working correctly when:**

✅ Supabase `market_participants` count increases by ~400 daily  
✅ GitHub Actions shows green checkmarks for daily runs  
✅ App displays recent update timestamps  
✅ Companies have `brandfetch_verified: true`  
✅ Data quality scores average 75%+  
✅ No errors in update logs  
✅ Cross-device sync working (iPad ↔ Android)  

---

## 📝 Version History

**v2.0 (January 24, 2026)**
- Fixed Autonomous Updater to use server-side API
- Integrated Brandfetch verification
- Enabled RLS with proper policies
- Added comprehensive documentation

**v1.0 (Initial Release)**
- Basic autonomous updater
- OpenAI integration
- Manual CSV upload

---

## 🚀 Future Enhancements

**Planned Features:**
- [ ] Custom commodity selection in app
- [ ] Real-time progress tracking
- [ ] Email notifications for updates
- [ ] Advanced filtering and search
- [ ] Bulk export functionality
- [ ] Company deduplication tool
- [ ] Quality score dashboard

---

**End of Documentation**

*For questions or issues, refer to the Troubleshooting section or check GitHub Actions logs.*
