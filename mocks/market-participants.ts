import { TradingHouse, Broker, MarketPlatform, MarketParticipant } from '@/types';
import { edibleOilsBuyersExtended } from './edible-oils-buyers-extended';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const tradingHouses: TradingHouse[] = [
  {
    id: 'vitol',
    name: 'Vitol',
    type: 'trading_house',
    category: ['energy_fuels', 'diversified'],
    headquarters: 'Geneva, Switzerland',
    offices: ['London', 'Houston', 'Singapore', 'Dubai', 'Geneva'],
    commodities: ['fuel_oil'],
    description: 'One of the largest independent energy and commodities traders globally, specializing in crude oil, refined products, fuels, and energy logistics.',
    verified: true,
    licenses: ['Swiss Commercial Registry', 'FCA Authorized'],
    website: 'https://www.vitol.com',
    tradingVolume: '300+ million tons/year',
    founded: 1966,
    specialization: 'Crude oil, refined products, and global energy logistics with extensive shipping assets',
    businessType: 'both' as const,
  },
  {
    id: 'trafigura',
    name: 'Trafigura',
    type: 'trading_house',
    category: ['energy_fuels', 'coal', 'diversified'],
    headquarters: 'Singapore',
    offices: ['Geneva', 'London', 'Houston', 'Singapore', 'Shanghai'],
    commodities: ['fuel_oil', 'steam_coal', 'anthracite_coal'],
    description: 'Major global trader of crude, refined products, coal, and gas/power. Active in physical freight, storage, blending, and logistics.',
    verified: true,
    licenses: ['Singapore ACRA', 'EU Trading License'],
    website: 'https://www.trafigura.com',
    tradingVolume: '250+ million tons/year',
    founded: 1993,
    specialization: 'Integrated oil, coal, and metals trading with global logistics infrastructure',
    businessType: 'both' as const,
  },
  {
    id: 'glencore',
    name: 'Glencore',
    type: 'trading_house',
    category: ['energy_fuels', 'coal', 'precious_metals', 'diversified'],
    headquarters: 'Baar, Switzerland',
    offices: ['London', 'Stamford', 'Singapore', 'Sydney', 'Johannesburg'],
    commodities: ['fuel_oil', 'steam_coal', 'anthracite_coal', 'gold'],
    description: 'Publicly listed multinational commodities giant trading energy products, fuels, coal, and metals & minerals across global markets.',
    verified: true,
    licenses: ['FTSE 100 Listed', 'Swiss Commercial Registry', 'FCA Listed'],
    website: 'https://www.glencore.com',
    tradingVolume: '400+ million tons/year',
    founded: 1974,
    specialization: 'Diversified global commodities with mining and trading operations',
    businessType: 'both' as const,
  },
  {
    id: 'mercuria',
    name: 'Mercuria Energy Group',
    type: 'trading_house',
    category: ['energy_fuels', 'diversified'],
    headquarters: 'Geneva, Switzerland',
    offices: ['Geneva', 'London', 'Houston', 'Singapore', 'Beijing'],
    commodities: ['fuel_oil'],
    description: 'One of the top five global energy traders in oil, gas, refined products, and power with operations in ~50 countries.',
    verified: true,
    licenses: ['Swiss Commercial Registry', 'Multi-jurisdictional Trading Licenses'],
    website: 'https://www.mercuria.com',
    tradingVolume: '150+ million tons/year',
    founded: 2004,
    specialization: 'Energy trading, fuel supplies, and structured financing',
    businessType: 'both' as const,
  },
  {
    id: 'gunvor',
    name: 'Gunvor Group',
    type: 'trading_house',
    category: ['energy_fuels', 'precious_metals', 'diversified'],
    headquarters: 'Geneva, Switzerland',
    offices: ['Geneva', 'London', 'Singapore', 'Houston', 'Rotterdam'],
    commodities: ['fuel_oil', 'gold'],
    description: 'Global energy trader focusing on crude, refined products, and transport/terminal logistics. Expanding into precious metals trading.',
    verified: true,
    licenses: ['Swiss Commercial Registry', 'Singapore Trading License'],
    website: 'https://www.gunvorgroup.com',
    tradingVolume: '200+ million tons/year',
    founded: 2000,
    specialization: 'Crude oil, refined products, and emerging precious metals desk',
    businessType: 'both' as const,
  },
  {
    id: 'alkagesta',
    name: 'Alkagesta',
    type: 'trading_house',
    category: ['energy_fuels', 'fertilizers', 'diversified'],
    headquarters: 'Malta',
    offices: ['Malta', 'Geneva', 'Dubai', 'Singapore'],
    commodities: ['fuel_oil', 'urea'],
    description: 'Emerging global trader headquartered in Malta handling oil products, refined fuels, fertilizers (e.g., urea), and petrochemicals with EU/UN compliance.',
    verified: true,
    licenses: ['Malta Business Registry', 'EU Export Controls'],
    website: 'https://www.alkagesta.com',
    founded: 2012,
    specialization: 'Diversified fuel and fertilizer supply with compliance frameworks',
    businessType: 'both' as const,
  },
  {
    id: 'phibro',
    name: 'Phibro LLC',
    type: 'trading_house',
    category: ['energy_fuels', 'precious_metals', 'diversified'],
    headquarters: 'Westport, Connecticut, USA',
    offices: ['Westport', 'London', 'Singapore', 'Tokyo'],
    commodities: ['fuel_oil', 'gold'],
    description: 'Long-established physical commodities trader with global operations across energy, metals, and derivatives.',
    verified: true,
    licenses: ['CFTC Registered', 'NFA Member'],
    website: 'https://www.phibro.com',
    founded: 1901,
    specialization: 'Legacy commodities firm with energy and metals focus',
    businessType: 'both' as const,
  },
  {
    id: 'adani-global',
    name: 'Adani Global Pte Ltd',
    type: 'trading_house',
    category: ['coal', 'diversified'],
    headquarters: 'Singapore',
    offices: ['Singapore', 'Mumbai', 'Sydney', 'Jakarta'],
    commodities: ['steam_coal', 'anthracite_coal'],
    description: 'Part of Adani Group, one of the largest coal traders and mining companies with extensive logistics and port infrastructure.',
    verified: true,
    licenses: ['SCoTA Licensed Member', 'Singapore ACRA'],
    website: 'https://www.adani.com',
    specialization: 'Coal mining, trading, and port logistics in Asia-Pacific',
    businessType: 'both' as const,
  },
  {
    id: 'anglo-american',
    name: 'Anglo American Marketing Limited',
    type: 'trading_house',
    category: ['coal', 'precious_metals', 'diversified'],
    headquarters: 'London, United Kingdom',
    offices: ['London', 'Johannesburg', 'Singapore', 'Santiago'],
    commodities: ['steam_coal', 'anthracite_coal', 'gold'],
    description: 'Mining and marketing arm of Anglo American plc, handling coal, platinum, and other minerals with global reach.',
    verified: true,
    licenses: ['SCoTA Licensed Member', 'FTSE 100 Listed', 'FCA Authorized'],
    website: 'https://www.angloamerican.com',
    specialization: 'Integrated mining and commodities marketing',
    businessType: 'both' as const,
  },
  {
    id: 'bhp-billiton',
    name: 'BHP Billiton Marketing AG',
    type: 'trading_house',
    category: ['coal', 'diversified'],
    headquarters: 'Zug, Switzerland',
    offices: ['Zug', 'Singapore', 'London', 'Melbourne'],
    commodities: ['steam_coal', 'anthracite_coal'],
    description: 'Marketing arm of BHP Group, one of the world\'s largest mining companies, trading coal, iron ore, and other bulk commodities.',
    verified: true,
    licenses: ['SCoTA Licensed Member', 'Swiss Commercial Registry'],
    website: 'https://www.bhp.com',
    specialization: 'Global coal and bulk commodities marketing',
    businessType: 'both' as const,
  },
  {
    id: 'arcelormittal',
    name: 'ArcelorMittal Sourcing SCA',
    type: 'trading_house',
    category: ['coal', 'diversified'],
    headquarters: 'Luxembourg',
    offices: ['Luxembourg', 'London', 'Chicago', 'Mumbai'],
    commodities: ['steam_coal', 'anthracite_coal'],
    description: 'Sourcing and trading division of ArcelorMittal, the world\'s leading steel company, handling coal and raw materials procurement.',
    verified: true,
    licenses: ['SCoTA Licensed Member', 'EU Trading License'],
    website: 'https://www.arcelormittal.com',
    specialization: 'Coal and industrial raw materials for steel production',
    businessType: 'both' as const,
  },
  {
    id: 'bulk-trading',
    name: 'Bulk Trading S.A.',
    type: 'trading_house',
    category: ['coal', 'diversified'],
    headquarters: 'Geneva, Switzerland',
    offices: ['Geneva', 'London', 'Singapore', 'Houston'],
    commodities: ['steam_coal', 'anthracite_coal'],
    description: 'Independent coal and bulk commodities trader with established relationships across global coal markets.',
    verified: true,
    licenses: ['SCoTA Licensed Member', 'Swiss Commercial Registry'],
    specialization: 'Specialized coal trading and logistics',
    businessType: 'both' as const,
  },
];

export const brokers: Broker[] = [
  {
    id: 'interactive-brokers',
    name: 'Interactive Brokers (IBKR)',
    type: 'broker',
    brokerType: ['fcm', 'clearing_member'],
    headquarters: 'Greenwich, Connecticut, USA',
    regulatedBy: ['SEC', 'CFTC', 'NFA', 'FCA'],
    commodities: ['fuel_oil', 'gold', 'steam_coal', 'anthracite_coal'],
    description: 'Regulated futures and commodities broker providing access to ICE, NYMEX, LME, and other major exchanges for energy, metals, and agricultural contracts.',
    verified: true,
    clearingRelationships: ['CME Group', 'ICE Clear', 'LME Clear'],
    website: 'https://www.interactivebrokers.com',
    licenseNumbers: [
      { authority: 'CFTC', number: 'FCM-0000' },
      { authority: 'FCA', number: '208159' },
    ],
  },
  {
    id: 'stonex',
    name: 'StoneX Group / StoneX Commodity Solutions',
    type: 'broker',
    brokerType: ['fcm', 'physical_broker'],
    headquarters: 'New York, USA',
    regulatedBy: ['CFTC', 'NFA', 'FCA', 'SEC'],
    commodities: ['fuel_oil', 'gold', 'steam_coal', 'anthracite_coal', 'urea'],
    description: 'Regulated broker active in OTC and exchange markets for commodities risk management, clearing, and execution services.',
    verified: true,
    clearingRelationships: ['CME Group', 'ICE Clear', 'LME Clear'],
    website: 'https://www.stonex.com',
    licenseNumbers: [
      { authority: 'CFTC', number: 'FCM-0001' },
      { authority: 'NFA', number: '0164842' },
    ],
  },
  {
    id: 'hsbc-bullion',
    name: 'HSBC Bank plc (Bullion Desk)',
    type: 'broker',
    brokerType: ['bullion_bank'],
    headquarters: 'London, United Kingdom',
    regulatedBy: ['FCA', 'LBMA'],
    commodities: ['gold'],
    description: 'One of the dominant bullion banks in OTC gold markets and LBMA hub, providing vaulting, transport, and trading services.',
    verified: true,
    clearingRelationships: ['LME Clear', 'LBMA Settlement'],
    website: 'https://www.hsbc.com/about-hsbc/structure-and-network/global-markets',
    licenseNumbers: [
      { authority: 'FCA', number: '114216' },
      { authority: 'LBMA', number: 'Market Maker' },
    ],
  },
  {
    id: 'icbc-standard',
    name: 'ICBC Standard Bank',
    type: 'broker',
    brokerType: ['bullion_bank'],
    headquarters: 'London, United Kingdom',
    regulatedBy: ['FCA', 'LBMA'],
    commodities: ['gold'],
    description: 'Major bullion bank specializing in precious metals trading, vaulting, and custody services in the LBMA market.',
    verified: true,
    clearingRelationships: ['LBMA Settlement'],
    website: 'https://www.icbcstandard.com',
    licenseNumbers: [
      { authority: 'FCA', number: '124408' },
      { authority: 'LBMA', number: 'Market Maker' },
    ],
  },
  {
    id: 'jp-morgan-bullion',
    name: 'JP Morgan Chase Bank (Bullion Desk)',
    type: 'broker',
    brokerType: ['bullion_bank', 'clearing_member'],
    headquarters: 'New York, USA',
    regulatedBy: ['SEC', 'CFTC', 'FCA', 'LBMA'],
    commodities: ['gold'],
    description: 'Global banking institution with extensive precious metals trading, clearing, and custody capabilities.',
    verified: true,
    clearingRelationships: ['CME Group', 'LBMA Settlement', 'LME Clear'],
    website: 'https://www.jpmorgan.com',
    licenseNumbers: [
      { authority: 'CFTC', number: 'FCM-0005' },
      { authority: 'LBMA', number: 'Market Maker' },
    ],
  },
  {
    id: 'ig-group',
    name: 'IG Group',
    type: 'broker',
    brokerType: ['fcm'],
    headquarters: 'London, United Kingdom',
    regulatedBy: ['FCA', 'ASIC', 'MAS'],
    commodities: ['fuel_oil', 'gold'],
    description: 'FCA-regulated broker focused on derivatives and CFDs across commodities, primarily for hedging and speculative strategies.',
    verified: true,
    clearingRelationships: ['Various Exchange Relationships'],
    website: 'https://www.ig.com',
    licenseNumbers: [
      { authority: 'FCA', number: '195355' },
    ],
  },
  {
    id: 'saxo-bank',
    name: 'Saxo Bank',
    type: 'broker',
    brokerType: ['fcm'],
    headquarters: 'Copenhagen, Denmark',
    regulatedBy: ['EU', 'FCA', 'MAS', 'ASIC'],
    commodities: ['fuel_oil', 'gold', 'steam_coal'],
    description: 'European online trading bank providing access to commodity futures, CFDs, and derivatives across multiple asset classes.',
    verified: true,
    clearingRelationships: ['Exchange Access via Prime Brokers'],
    website: 'https://www.home.saxo',
    licenseNumbers: [
      { authority: 'EU', number: 'Danish FSA License' },
      { authority: 'FCA', number: '551422' },
    ],
  },
  {
    id: 'bnp-paribas-commodities',
    name: 'BNP Paribas Commodities',
    type: 'broker',
    brokerType: ['physical_broker', 'clearing_member'],
    headquarters: 'Paris, France',
    regulatedBy: ['EU', 'FCA'],
    commodities: ['steam_coal', 'anthracite_coal', 'fuel_oil'],
    description: 'Banking institution active in physical and financial commodities markets, including coal trading and structured finance.',
    verified: true,
    clearingRelationships: ['ICE Clear', 'LME Clear'],
    website: 'https://www.bnpparibas.com',
    licenseNumbers: [
      { authority: 'EU', number: 'ECB Supervised' },
    ],
  },
];

export const platforms: MarketPlatform[] = [
  {
    id: 'globalcoal',
    name: 'globalCOAL',
    type: 'platform',
    category: 'coal_market',
    headquarters: 'London, United Kingdom',
    commodities: ['steam_coal', 'anthracite_coal'],
    description: 'Licensed trading community framework (SCoTA) for standardized coal trading with vetted members including major producers, traders, and financial institutions.',
    verified: true,
    members: [
      'Adani Global Pte Ltd',
      'Anglo American Marketing Limited',
      'BHP Billiton Marketing AG',
      'ArcelorMittal Sourcing SCA',
      'Bulk Trading S.A.',
      'BNP Paribas',
      'Glencore Coal',
      'Trafigura',
    ],
    website: 'https://www.globalcoal.com',
    framework: 'Standard Coal Trading Agreement (SCoTA)',
  },
  {
    id: 'lme',
    name: 'London Metal Exchange (LME)',
    type: 'platform',
    category: 'exchange',
    headquarters: 'London, United Kingdom',
    commodities: ['gold'],
    description: 'World\'s premier non-ferrous metals exchange, offering futures and options contracts with physical delivery capabilities.',
    verified: true,
    website: 'https://www.lme.com',
    framework: 'LME Rules and Regulations',
  },
  {
    id: 'ice',
    name: 'Intercontinental Exchange (ICE)',
    type: 'platform',
    category: 'exchange',
    headquarters: 'Atlanta, Georgia, USA',
    commodities: ['fuel_oil', 'steam_coal'],
    description: 'Global exchange operator for energy, commodities, and financial contracts including crude oil, refined products, and coal futures.',
    verified: true,
    website: 'https://www.theice.com',
    framework: 'ICE Futures Trading Rules',
  },
  {
    id: 'nymex',
    name: 'New York Mercantile Exchange (NYMEX)',
    type: 'platform',
    category: 'exchange',
    headquarters: 'New York, USA',
    commodities: ['fuel_oil', 'gold'],
    description: 'Part of CME Group, NYMEX is a leading exchange for energy and precious metals futures with physical delivery options.',
    verified: true,
    website: 'https://www.cmegroup.com/markets/energy.html',
    framework: 'CME Group Rules',
  },
  {
    id: 'lbma',
    name: 'London Bullion Market Association (LBMA)',
    type: 'platform',
    category: 'exchange',
    headquarters: 'London, United Kingdom',
    commodities: ['gold'],
    description: 'Trade association and global hub for OTC gold and silver markets, maintaining quality standards and settlement systems.',
    verified: true,
    website: 'https://www.lbma.org.uk',
    framework: 'LBMA Good Delivery Standards',
  },
];

export const edibleOilsBuyers: TradingHouse[] = [
  {
    id: 'metro-ag',
    name: 'Metro AG',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Düsseldorf, Germany',
    offices: ['Düsseldorf'],
    commodities: ['edible_oils'],
    description: 'Major European wholesale and retail company purchasing edible oils for distribution.',
    verified: true,
    licenses: ['German Trade Registry'],
    website: 'https://www.metro.de',
    specialization: 'Wholesale distribution of edible oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'carrefour-group',
    name: 'Carrefour Group',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Massy, France',
    offices: ['Paris', 'Massy'],
    commodities: ['edible_oils'],
    description: 'Global retail leader sourcing olive oil, sunflower oil, palm oil, and vegetable oil.',
    verified: true,
    licenses: ['French Commercial Registry'],
    website: 'https://www.carrefour.com',
    specialization: 'Retail procurement of edible oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'tesco-plc',
    name: 'Tesco PLC',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Welwyn Garden City, UK',
    offices: ['London', 'Welwyn Garden City'],
    commodities: ['edible_oils'],
    description: 'Leading UK retailer purchasing vegetable oil, rapeseed oil, sunflower oil, and palm oil.',
    verified: true,
    licenses: ['FCA Listed', 'UK Companies House'],
    website: 'https://www.tesco.com',
    specialization: 'Supermarket edible oils procurement',
    businessType: 'buyer' as const,
  },
  {
    id: 'walmart-inc',
    name: 'Walmart Inc.',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Bentonville, AR, USA',
    offices: ['Bentonville', 'New York', 'San Francisco'],
    commodities: ['edible_oils'],
    description: 'World\'s largest retailer sourcing palm oil, soybean oil, canola oil, and vegetable oil.',
    verified: true,
    licenses: ['SEC Registered', 'NYSE Listed'],
    website: 'https://www.walmart.com',
    specialization: 'Large-scale retail edible oils procurement',
    businessType: 'buyer' as const,
  },
  {
    id: 'sainsburys',
    name: 'Sainsbury\'s',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'London, UK',
    offices: ['London'],
    commodities: ['edible_oils'],
    description: 'UK supermarket chain buying vegetable oil, olive oil, sunflower oil, and rapeseed oil.',
    verified: true,
    licenses: ['LSE Listed', 'UK Companies House'],
    website: 'https://www.sainsburys.co.uk',
    specialization: 'Premium retail edible oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'costco-wholesale',
    name: 'Costco Wholesale',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Issaquah, WA, USA',
    offices: ['Issaquah', 'Seattle'],
    commodities: ['edible_oils'],
    description: 'Warehouse club purchasing bulk vegetable oil, palm oil, olive oil, and coconut oil.',
    verified: true,
    licenses: ['NASDAQ Listed', 'SEC Registered'],
    website: 'https://www.costco.com',
    specialization: 'Bulk edible oils wholesale',
    businessType: 'buyer' as const,
  },
  {
    id: 'aldi-group',
    name: 'Aldi Group',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Mülheim an der Ruhr, Germany',
    offices: ['Mülheim', 'Essen'],
    commodities: ['edible_oils'],
    description: 'Discount supermarket chain sourcing cooking oil, vegetable oil, olive oil, and sunflower oil.',
    verified: true,
    licenses: ['German Trade Registry'],
    website: 'https://www.aldi.com',
    specialization: 'Value edible oils procurement',
    businessType: 'buyer' as const,
  },
  {
    id: 'lidl-stiftung',
    name: 'Lidl Stiftung & Co.',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Neckarsulm, Germany',
    offices: ['Neckarsulm', 'Baden-Württemberg'],
    commodities: ['edible_oils'],
    description: 'European discount retailer buying vegetable oil, sunflower oil, olive oil, and rapeseed oil.',
    verified: true,
    licenses: ['German Trade Registry'],
    website: 'https://www.lidl.com',
    specialization: 'Discount edible oils sourcing',
    businessType: 'buyer' as const,
  },
  {
    id: 'reliance-retail',
    name: 'Reliance Retail',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Navi Mumbai, India',
    offices: ['Mumbai', 'Delhi', 'Bangalore'],
    commodities: ['edible_oils'],
    description: 'India\'s largest retailer purchasing palm oil, sunflower oil, mustard oil, and soybean oil.',
    verified: true,
    licenses: ['Indian ROC'],
    website: 'https://www.relianceretail.com',
    specialization: 'Indian market edible oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'unilever-plc',
    name: 'Unilever PLC',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'London, UK',
    offices: ['London', 'Rotterdam', 'Singapore'],
    commodities: ['edible_oils'],
    description: 'Global FMCG leader sourcing palm oil, soybean oil, sunflower oil, and coconut oil for food products.',
    verified: true,
    licenses: ['LSE Listed', 'NYSE Listed'],
    website: 'https://www.unilever.com',
    specialization: 'FMCG edible oils procurement',
    businessType: 'buyer' as const,
  },
  {
    id: 'nestle-sa',
    name: 'Nestlé SA',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Vevey, Switzerland',
    offices: ['Vevey', 'Frankfurt', 'Singapore'],
    commodities: ['edible_oils'],
    description: 'World\'s largest food company buying palm oil, vegetable oil, coconut oil, and sunflower oil.',
    verified: true,
    licenses: ['SIX Swiss Listed'],
    website: 'https://www.nestle.com',
    specialization: 'Food manufacturing oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'pepsico-inc',
    name: 'PepsiCo Inc.',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Purchase, NY, USA',
    offices: ['New York', 'Dallas', 'Chicago'],
    commodities: ['edible_oils'],
    description: 'Food and beverage giant sourcing vegetable oil, palm oil, sunflower oil, and corn oil.',
    verified: true,
    licenses: ['NASDAQ Listed'],
    website: 'https://www.pepsico.com',
    specialization: 'Snack food oils procurement',
    businessType: 'buyer' as const,
  },
  {
    id: 'mondelez-international',
    name: 'Mondelez International Inc.',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Chicago, IL, USA',
    offices: ['Chicago', 'Zurich', 'Singapore'],
    commodities: ['edible_oils'],
    description: 'Snack food manufacturer buying palm oil, vegetable oil, coconut oil, and sunflower oil.',
    verified: true,
    licenses: ['NASDAQ Listed'],
    website: 'https://www.mondelezinternational.com',
    specialization: 'Confectionery oils sourcing',
    businessType: 'buyer' as const,
  },
  {
    id: 'general-mills',
    name: 'General Mills Inc.',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Minneapolis, MN, USA',
    offices: ['Minneapolis', 'Chicago'],
    commodities: ['edible_oils'],
    description: 'Food manufacturer purchasing vegetable oil, soybean oil, canola oil, and palm oil.',
    verified: true,
    licenses: ['NYSE Listed'],
    website: 'https://www.generalmills.com',
    specialization: 'Packaged foods oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'wilmar-international',
    name: 'Wilmar International Limited',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Singapore',
    offices: ['Singapore', 'Jakarta', 'Shanghai'],
    commodities: ['edible_oils'],
    description: 'Asia\'s leading agribusiness buying palm oil, soybean oil, sunflower oil, and coconut oil.',
    verified: true,
    licenses: ['SGX Listed'],
    website: 'https://www.wilmar-international.com',
    specialization: 'Palm oil and tropical oils',
    businessType: 'both' as const,
  },
  {
    id: 'cargill-india',
    name: 'Cargill India Pvt Ltd',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Gurgaon, India',
    offices: ['Gurgaon', 'Mumbai', 'Chennai'],
    commodities: ['edible_oils'],
    description: 'Agribusiness giant sourcing palm oil, soybean oil, sunflower oil, and mustard oil.',
    verified: true,
    licenses: ['Indian ROC'],
    website: 'https://www.cargill.co.in',
    specialization: 'Agricultural commodity oils',
    businessType: 'both' as const,
  },
  {
    id: 'adani-wilmar',
    name: 'Adani Wilmar Limited',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Ahmedabad, India',
    offices: ['Ahmedabad', 'Mumbai'],
    commodities: ['edible_oils'],
    description: 'Major Indian edible oils company buying palm oil, soybean oil, sunflower oil, and mustard oil.',
    verified: true,
    licenses: ['NSE Listed', 'BSE Listed'],
    website: 'https://www.adaniwilmar.com',
    specialization: 'Indian edible oils market leader',
    businessType: 'both' as const,
  },
  {
    id: 'cofco-international',
    name: 'Cofco International',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Beijing, China',
    offices: ['Beijing', 'Shanghai', 'Hong Kong'],
    commodities: ['edible_oils'],
    description: 'Chinese state-owned agribusiness purchasing soybean oil, palm oil, rapeseed oil, and sunflower oil.',
    verified: true,
    licenses: ['Chinese State Enterprise'],
    website: 'https://www.cofcointernational.com',
    specialization: 'Chinese market oils procurement',
    businessType: 'buyer' as const,
  },
  {
    id: 'savola-group',
    name: 'Savola Group',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Jeddah, Saudi Arabia',
    offices: ['Jeddah', 'Riyadh'],
    commodities: ['edible_oils'],
    description: 'Middle East food company sourcing palm oil, sunflower oil, corn oil, and soybean oil.',
    verified: true,
    licenses: ['Tadawul Listed'],
    website: 'https://www.savola.com',
    specialization: 'Middle East edible oils',
    businessType: 'both' as const,
  },
  {
    id: 'bidco-africa',
    name: 'Bidco Africa',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Nairobi, Kenya',
    offices: ['Nairobi', 'Kampala'],
    commodities: ['edible_oils'],
    description: 'East African consumer goods company buying palm oil, sunflower oil, coconut oil, and soybean oil.',
    verified: true,
    licenses: ['Kenyan Business Registry'],
    website: 'https://www.bidcoafrica.com',
    specialization: 'African market edible oils',
    businessType: 'both' as const,
  },
  {
    id: 'bunge-brasil',
    name: 'Bunge Brasil',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'São Paulo, Brazil',
    offices: ['São Paulo', 'Rio de Janeiro'],
    commodities: ['edible_oils'],
    description: 'Agribusiness leader purchasing soybean oil, palm oil, sunflower oil, and corn oil.',
    verified: true,
    licenses: ['NYSE Listed'],
    website: 'https://www.bunge.com.br',
    specialization: 'South American oilseeds',
    businessType: 'both' as const,
  },
  {
    id: 'sysco-corporation',
    name: 'Sysco Corporation',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Houston, TX, USA',
    offices: ['Houston', 'Boston', 'Los Angeles'],
    commodities: ['edible_oils'],
    description: 'Food distributor buying bulk cooking oil, vegetable oil, canola oil, and soybean oil.',
    verified: true,
    licenses: ['NYSE Listed'],
    website: 'https://www.sysco.com',
    specialization: 'Food service oils distribution',
    businessType: 'buyer' as const,
  },
  {
    id: 'us-foods',
    name: 'US Foods Holding Corp.',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Rosemont, IL, USA',
    offices: ['Chicago', 'Rosemont'],
    commodities: ['edible_oils'],
    description: 'Food service distributor sourcing commercial cooking oil, vegetable oil, canola oil, and palm oil.',
    verified: true,
    licenses: ['NYSE Listed'],
    website: 'https://www.usfoods.com',
    specialization: 'Commercial kitchen oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'woolworths-group',
    name: 'Woolworths Group Limited',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Bella Vista, NSW, Australia',
    offices: ['Sydney', 'Melbourne'],
    commodities: ['edible_oils'],
    description: 'Australian retailer purchasing vegetable oil, olive oil, canola oil, and sunflower oil.',
    verified: true,
    licenses: ['ASX Listed'],
    website: 'https://www.woolworthsgroup.com.au',
    specialization: 'Australian market edible oils',
    businessType: 'buyer' as const,
  },
  {
    id: 'itc-limited',
    name: 'ITC Limited',
    type: 'trading_house',
    category: ['edible_oils'],
    headquarters: 'Kolkata, India',
    offices: ['Kolkata', 'Mumbai', 'Delhi'],
    commodities: ['edible_oils'],
    description: 'Indian conglomerate buying mustard oil, soybean oil, palm oil, and sunflower oil.',
    verified: true,
    licenses: ['NSE Listed', 'BSE Listed'],
    website: 'https://www.itcportal.com',
    specialization: 'Indian FMCG oils',
    businessType: 'buyer' as const,
  },
];

let importedParticipants: MarketParticipant[] = [];
let supabaseParticipants: MarketParticipant[] = [];
let isLoaded = false;
let loadingPromise: Promise<void> | null = null;
let cachedAllParticipants: MarketParticipant[] | null = null;
let lastCacheKey = '';

export const baseMarketParticipants: MarketParticipant[] = [
  ...tradingHouses,
  ...brokers,
  ...platforms,
  ...edibleOilsBuyers,
];
export const allMarketParticipants: MarketParticipant[] = baseMarketParticipants;

export const getAllMarketParticipants = (): MarketParticipant[] => {
  // Create cache key based on array lengths to detect changes
  const cacheKey = `<LaTex>${supabaseParticipants.length}-$</LaTex>{importedParticipants.length}-${baseMarketParticipants.length}`;
  
  // Return cached result if data hasn't changed
  if (cachedAllParticipants && cacheKey === lastCacheKey) {
    return cachedAllParticipants;
  }
  
  if (!isLoaded) {
    console.warn('[MarketParticipants] ⚠️ WARNING: getAllMarketParticipants called before data loaded!');
  }
  
  // Recalculate and cache
  const all = [...supabaseParticipants, ...importedParticipants, ...baseMarketParticipants];
  cachedAllParticipants = all;
  lastCacheKey = cacheKey;
  
  console.log('[MarketParticipants] 📊 getAllMarketParticipants: base =', baseMarketParticipants.length, ', supabase =', supabaseParticipants.length, ', local imported =', importedParticipants.length, ', total =', all.length, '(cached)');
  return all;
};


export const loadImportedParticipants = async () => {
  if (isLoaded) {
    console.log('[MarketParticipants] Already loaded, skipping');
    return;
  }
  
  if (loadingPromise) {
    console.log('[MarketParticipants] Load already in progress, waiting...');
    await loadingPromise;
    return;
  }
  
  loadingPromise = (async () => {
    try {
      console.log('[MarketParticipants] 🔄 Loading participants from API (fetching up to 1000 companies)...');
      
      // Fetch 10 pages to get up to 1000 companies (100 per page)
      const allParticipants = [];
      const maxPages = 10;
      
      for (let page = 1; page <= maxPages; page++) {
        const response = await fetch(`/api/market-participants?page=${page}&limit=100`);
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          console.error('[MarketParticipants] ❌ Error loading page', page, ':', result.error || 'Unknown error');
          break; // Stop fetching on error
        }
        
        if (result.participants && result.participants.length > 0) {
          allParticipants.push(...result.participants);
          console.log(`[MarketParticipants] 📄 Loaded page ${page}/${maxPages}: ${result.participants.length} companies (total so far: ${allParticipants.length})`);
          
          // Stop if we got fewer results than requested (last page)
          if (result.participants.length < 100) {
            console.log('[MarketParticipants] ℹ️ Reached last page');
            break;
          }
        } else {
          console.log('[MarketParticipants] ℹ️ No more participants on page', page);
          break;
        }
      }

      if (allParticipants.length === 0) {
        console.log('[MarketParticipants] ⚠️ No participants found in Supabase (this is normal for first run)');
        supabaseParticipants = [];
        isLoaded = true;
      } else {
        const supabaseData = allParticipants;
        supabaseParticipants = supabaseData.map((row: any) => {
          const base = {
            id: row.id,
            name: row.name,
            type: row.type as any,
            headquarters: row.headquarters,
            description: row.description,
            verified: row.verified,
            website: row.website,
            commodities: row.commodities as any[],
          };

          if (row.type === 'trading_house') {
            return {
              ...base,
              category: row.category as any[],
              offices: row.offices,
              licenses: row.licenses,
              specialization: row.specialization,
              businessType: row.business_type as any,
              logo: row.logo,
              brandColor: row.brand_color,
              email: row.email,
              contactLinks: row.contact_links,
              founded: row.founded,
              tradingVolume: row.trading_volume,
            } as TradingHouse;
          } else if (row.type === 'broker') {
            return {
              ...base,
              brokerType: row.broker_type as any[],
              regulatedBy: row.regulated_by,
              clearingRelationships: row.clearing_relationships,
              licenseNumbers: row.license_numbers,
            } as Broker;
          } else {
            return {
              ...base,
              category: row.category?.[0] as any,
              framework: row.framework,
              members: row.members,
            } as MarketPlatform;
          }
        });
        console.log('[MarketParticipants] ✅ Successfully loaded', supabaseParticipants.length, 'participants from Supabase');
      }
    } catch (error) {
      console.error('[MarketParticipants] ❌ CRITICAL: Error loading from Supabase:', JSON.stringify({
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }, null, 2));
      supabaseParticipants = [];
      isLoaded = false; // Don't mark as loaded on error
    } finally {
      loadingPromise = null;
    }
  })();
  
  await loadingPromise;
};

export const addMarketParticipants = async (participants: MarketParticipant[]) => {
  console.log('[MarketParticipants] 🔄 Adding', participants.length, 'new participants to Supabase... [v2.0-RLS-FIX]');
  
  await loadImportedParticipants();
  
  console.log('[MarketParticipants] 📊 Current state before adding: isLoaded =', isLoaded, ', existing count =', importedParticipants.length);
  
  try {
    // Prepare data for Supabase insertion
    const supabaseData = participants.map(p => {
      const base = {
        id: p.id,
        name: p.name,
        type: p.type,
        headquarters: p.headquarters,
        description: p.description,
        verified: p.verified,
        website: p.website,
        commodities: p.commodities,
      };

      if (p.type === 'trading_house') {
        const th = p as TradingHouse;
        const data: any = {
          ...base,
          category: th.category || [],
          offices: th.offices || [],
          licenses: th.licenses || [],
          specialization: th.specialization || null,
          business_type: th.businessType || null,
        };
        // Only include optional fields if they have values
        if (th.logo) data.logo = th.logo;
        if (th.brandColor) data.brand_color = th.brandColor;
        if (th.email) data.email = th.email;
        if (th.contactLinks) data.contact_links = th.contactLinks;
        if (th.founded) data.founded = th.founded;
        if (th.tradingVolume) data.trading_volume = th.tradingVolume;
        return data;
      } else if (p.type === 'broker') {
        const b = p as Broker;
        return {
          ...base,
          broker_type: b.brokerType || [],
          regulated_by: b.regulatedBy || [],
          clearing_relationships: b.clearingRelationships || [],
          license_numbers: b.licenseNumbers || [],
        };
      } else {
        const mp = p as MarketPlatform;
        return {
          ...base,
          category: [mp.category],
          framework: mp.framework || null,
          members: mp.members || null,
        };
      }
    });

    // Insert into Supabase
    const { data, error } = await supabase
      .from('market_participants')
      .insert(supabaseData)
      .select();

    if (error) {
      console.error('[MarketParticipants] ❌ Error saving to Supabase:', JSON.stringify({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }, null, 2));
      throw error;
    }

    console.log('[MarketParticipants] ✅ Successfully saved', participants.length, 'participants to Supabase');
    
    // Add to local cache
    supabaseParticipants = [...supabaseParticipants, ...participants];
    
    console.log('[MarketParticipants] ✅ Added', participants.length, 'participants. Total in Supabase:', supabaseParticipants.length);
  } catch (error) {
    console.error('[MarketParticipants] ❌ CRITICAL: Failed to save participants:', error);
    throw error;
  }
};

export const getImportedParticipants = (): MarketParticipant[] => {
  if (!isLoaded) {
    console.warn('[MarketParticipants] ⚠️ WARNING: getImportedParticipants called before data loaded!');
  }
  const combined = [...supabaseParticipants, ...importedParticipants];
  // Limit to 1000 companies to prevent browser crashes on tablets/laptops
  const limited = combined.slice(0, 1000);
  console.log('[MarketParticipants] 📊 Returning:', supabaseParticipants.length, 'from Supabase +', importedParticipants.length, 'local =', combined.length, 'total (limited to', limited.length, ') (loaded:', isLoaded, ')');
  return limited;
};

export const forceReloadParticipants = async () => {
  console.log('[MarketParticipants] 🔄 Force reloading from Supabase shared database...');
  isLoaded = false;
  loadingPromise = null;
  await loadImportedParticipants();
  console.log('[MarketParticipants] ✅ Force reload complete, returning', supabaseParticipants.length, 'Supabase +', importedParticipants.length, 'local participants');
  return [...supabaseParticipants, ...importedParticipants];
};

export const clearImportedParticipants = async () => {
  importedParticipants = [];
  console.log('[MarketParticipants] Cleared local imported participants (Supabase data remains)');
};

export const getCommodityLabel = (commodity: string): string => {
  const labels: Record<string, string> = {
    gold: 'Gold',
    fuel_oil: 'Fuel Oil',
    steam_coal: 'Steam Coal',
    anthracite_coal: 'Anthracite Coal',
    urea: 'Urea',
    edible_oils: 'Edible Oils',
    bio_fuels: 'Bio-Fuels',
    iron_ore: 'Iron Ore',
  };
  return labels[commodity] || commodity;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    energy_fuels: 'Energy & Fuels',
    coal: 'Coal',
    precious_metals: 'Precious Metals',
    fertilizers: 'Fertilizers',
    edible_oils: 'Edible Oils',
    diversified: 'Diversified',
  };
  return labels[category] || category;
};
// Deploy trigger: Sun Feb  1 10:32:30 EST 2026
