export type UserRole = 
  | 'trade_originator' 
  | 'compliance_officer' 
  | 'risk_manager' 
  | 'legal_reviewer' 
  | 'senior_management' 
  | 'operations_manager' 
  | 'admin';

export type CommodityType = 'gold' | 'fuel_oil' | 'steam_coal' | 'anthracite_coal' | 'urea' | 'edible_oils';

export type RiskLevel = 'green' | 'amber' | 'red';

export type TradeStatus = 
  | 'draft' 
  | 'counterparty_review' 
  | 'risk_approval' 
  | 'legal_review' 
  | 'compliance_check' 
  | 'financing_pending' 
  | 'active' 
  | 'in_transit' 
  | 'delivered' 
  | 'settled' 
  | 'rejected';

export type DocumentType = 
  | 'corporate_docs' 
  | 'license' 
  | 'financial_statement' 
  | 'bank_reference' 
  | 'loi' 
  | 'pof' 
  | 'msa' 
  | 'spa' 
  | 'mfpa' 
  | 'lc' 
  | 'bol' 
  | 'certificate_origin' 
  | 'quality_cert';

export interface RiskScore {
  legal_licensing: number;
  financial_strength: number;
  compliance_sanctions: number;
  operations_logistics: number;
  commodity_specific: number;
  overall: number;
  level: RiskLevel;
}

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  uploadedAt: Date;
  uploadedBy: string;
  url: string;
  verified: boolean;
}

export interface Counterparty {
  id: string;
  name: string;
  country: string;
  type: 'buyer' | 'seller';
  onboardedAt: Date;
  riskScore: RiskScore;
  documents: Document[];
  approved: boolean;
  approvalConditions?: string[];
  status: 'pending_ddq' | 'under_review' | 'approved' | 'rejected';
}

export interface Trade {
  id: string;
  commodity: CommodityType;
  counterpartyId: string;
  counterpartyName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalValue: number;
  currency: string;
  incoterm: string;
  deliveryWindow: { start: Date; end: Date };
  status: TradeStatus;
  createdAt: Date;
  createdBy: string;
  documents: Document[];
  riskLevel: RiskLevel;
  alerts: Alert[];
  commissionRate?: number;
  commissionAmount?: number;
  commissionPaid?: boolean;
  commissionPaidAt?: Date;
  paypalOrderId?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export type TraderCategory = 'energy_fuels' | 'coal' | 'precious_metals' | 'fertilizers' | 'edible_oils' | 'diversified';

export type BrokerType = 'fcm' | 'physical_broker' | 'bullion_bank' | 'clearing_member';

export type RegulationAuthority = 'CFTC' | 'FCA' | 'MAS' | 'SEC' | 'NFA' | 'CySEC' | 'ASIC' | 'LBMA' | 'EU';

export interface TradingHouse {
  id: string;
  name: string;
  type: 'trading_house';
  category: TraderCategory[];
  headquarters: string;
  offices: string[];
  commodities: CommodityType[];
  description: string;
  verified: boolean;
  licenses: string[];
  website?: string;
  tradingVolume?: string;
  founded?: number;
  specialization: string;
  businessType?: 'buyer' | 'seller' | 'both';
}

export interface Broker {
  id: string;
  name: string;
  type: 'broker';
  brokerType: BrokerType[];
  headquarters: string;
  regulatedBy: RegulationAuthority[];
  commodities: CommodityType[];
  description: string;
  verified: boolean;
  clearingRelationships: string[];
  website?: string;
  licenseNumbers: { authority: string; number: string }[];
}

export interface MarketPlatform {
  id: string;
  name: string;
  type: 'platform';
  category: 'coal_market' | 'exchange' | 'clearing_house';
  headquarters: string;
  commodities: CommodityType[];
  description: string;
  verified: boolean;
  members?: string[];
  website?: string;
  framework: string;
}

export type MarketParticipant = TradingHouse | Broker | MarketPlatform;

export interface CompanyVerification {
  verificationDate: Date;
  lastContactDate?: Date;
  responseRate?: number;
  contactCount?: number;
  respondedCount?: number;
}

export interface CompanyRating {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  date: Date;
  verified: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  type: 'all' | 'trading_house' | 'broker' | 'platform';
  commodity: string;
  businessType: 'all' | 'buyer' | 'seller' | 'both';
  searchQuery: string;
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'rfq' | 'partnership' | 'inquiry' | 'follow_up' | 'custom';
}

export interface EmailOutreach {
  id: string;
  recipientIds: string[];
  template: EmailTemplate;
  sentAt: Date;
  status: 'draft' | 'sent' | 'failed';
}

export interface WalletBalance {
  available: number;
  pending: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission' | 'platform_fee';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: Date;
  paypalOrderId?: string;
  tradeId?: string;
}
