import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

const MANUAL_CONTENT = `# Fox Trade Master™ Global Trading App
## User Manual

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Role Selection](#role-selection)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Trades](#managing-trades)
5. [Managing Counterparties](#managing-counterparties)
6. [Document Management](#document-management)
7. [Market Directory](#market-directory)
8. [Understanding Risk Levels](#understanding-risk-levels)
9. [Trade Workflow](#trade-workflow)
10. [Document Types](#document-types)
11. [Support & Contact](#support--contact)

---

## Getting Started

### First Launch
1. Open the Fox Trade Master™ app
2. You'll be greeted with the role selection screen
3. Choose your role based on your responsibilities in the organization
4. Once selected, you'll be taken to the main dashboard

### Navigation
The app uses a tab-based navigation system with 5 main sections:
- **Dashboard** - Overview of your portfolio and recent activity
- **Trades** - Manage all trading activities
- **Counterparties** - Manage business relationships
- **Documents** - Upload, view, and send documents
- **Market** - Directory of verified market participants

---

## Role Selection

### Available Roles

#### 1. Trade Originator
**Responsibilities:**
- Create and manage trades
- Negotiate with counterparties
- Submit trades for approval

**Key Features:**
- Create new trades
- View trade pipeline
- Track trade status
- Access market directory

#### 2. Compliance Officer
**Responsibilities:**
- Ensure regulatory compliance
- Review counterparty sanctions
- Approve compliance checks

**Key Features:**
- Review counterparty risk scores
- Access compliance documents
- Monitor sanctions compliance
- Approve/reject trades at compliance stage

#### 3. Risk Manager
**Responsibilities:**
- Assess counterparty risk
- Monitor portfolio exposure
- Set risk limits

**Key Features:**
- View detailed risk scores
- Analyze portfolio metrics
- Review counterparty financials
- Approve/reject based on risk assessment

#### 4. Legal Reviewer
**Responsibilities:**
- Review contracts and agreements
- Ensure legal compliance
- Draft and negotiate terms

**Key Features:**
- Review Master Service Agreements (MSA)
- Review Sales Purchase Agreements (SPA)
- Approve/reject legal documentation
- Access contract templates

#### 5. Operations Manager
**Responsibilities:**
- Track logistics and delivery
- Coordinate shipments
- Manage documentation

**Key Features:**
- Monitor trade transit status
- Track delivery windows
- Manage shipping documents
- Coordinate with logistics providers

#### 6. System Admin
**Responsibilities:**
- System administration
- User management
- Full oversight

**Key Features:**
- Access to all features
- System configuration
- User role management
- Complete data access

---

## Dashboard Overview

### Key Metrics Displayed

#### Total Portfolio Value
Shows the aggregate value of all active trades in your portfolio in USD millions.

#### Active Trades
Number of trades currently in progress (from financing pending to in transit).

#### Pending Approvals
Trades awaiting approval from compliance, risk, legal, or operations teams.

#### Critical Alerts
High-priority issues requiring immediate attention (sanctions hits, expired documents, delivery delays).

#### Approved Counterparties
Number of counterparties that have passed due diligence and risk assessment.

### Trade Pipeline
Visual representation of trades by status:
- **Draft** - Initial trade creation
- **Counterparty Review** - Under counterparty evaluation
- **Risk Approval** - Awaiting risk manager approval
- **Legal Review** - Under legal team review
- **Compliance Check** - Compliance verification
- **Financing Pending** - Awaiting financial arrangements
- **Active** - Trade is live and executing
- **In Transit** - Goods are being shipped
- **Delivered** - Goods received by counterparty
- **Settled** - Financial settlement complete

### Recent Trades
Quick access to your 3 most recent trades with key information:
- Commodity type
- Counterparty name
- Quantity and value
- Current status
- Risk level
- Active alerts

### Quick Actions
- **+ Button (Top Right)** - Create a new trade instantly

---

## Managing Trades

### Viewing All Trades
1. Tap the **Trades** tab in the bottom navigation
2. View all trades in a scrollable list
3. Each trade card displays:
   - Commodity icon and name
   - Counterparty name
   - Quantity, value, and price per unit
   - Current status
   - Risk level badge
   - Alert count (if any)
   - Incoterm

### Searching Trades
1. Use the search bar at the top of the Trades screen
2. Search by:
   - Counterparty name
   - Commodity type
   - Trade ID

### Filtering Trades
Tap filter chips to view trades by status:
- All
- Active
- Financing Pending
- Legal Review
- In Transit

### Creating a New Trade
1. Tap the **+** button in Dashboard or Trades screen
2. Fill in the following information:
   - **Commodity Type** - Select from gold, fuel oil, steam coal, anthracite coal, or urea
   - **Counterparty** - Choose from approved counterparties
   - **Quantity** - Enter amount and unit (MT, BBL, oz)
   - **Price Per Unit** - Enter price in USD
   - **Incoterm** - Select delivery terms (FOB, CIF, CFR, etc.)
   - **Delivery Window** - Set start and end dates
3. Review the calculated total value
4. Submit for approval

### Understanding Risk Levels

#### GREEN - Low Risk
- Score: 80-100
- **Meaning**: Counterparty is well-established, financially sound, and compliant
- **Action**: Approved for trading, minimal oversight needed

#### AMBER - Medium Risk
- Score: 50-79
- **Meaning**: Some risk factors present, additional scrutiny required
- **Action**: Conditional approval, enhanced monitoring

#### RED - High Risk
- Score: 0-49
- **Meaning**: Significant risk factors, trading not recommended
- **Action**: Typically rejected, requires exceptional approval

---

## Trade Workflow

### Standard Trade Lifecycle

1. **Draft** - Trade Originator creates trade
2. **Counterparty Review** - Internal review of counterparty suitability
3. **Risk Approval** - Risk Manager reviews trade
4. **Legal Review** - Legal team reviews contract terms
5. **Compliance Check** - Compliance Officer performs final checks
6. **Financing Pending** - Arrange Letter of Credit
7. **Active** - Trade is live
8. **In Transit** - Goods have been shipped
9. **Delivered** - Goods received by counterparty
10. **Settled** - Payment completed

---

## Document Types

### Pre-Trade Documents

**Letter of Intent (LOI)**
- Buyer's preliminary interest in purchasing
- Non-binding expression of intent

**Soft Corporate Offer (SCO)**
- Seller's preliminary offer
- Subject to final negotiation

**Irrevocable Corporate Purchase Order (ICPO)**
- Buyer's binding commitment to purchase
- Legally binding once accepted

**Proof of Funds (POF)**
- Bank document verifying buyer has funds
- Required for large transactions

**Non-Circumvention Non-Disclosure Agreement (NCNDA)**
- Protects parties from being circumvented in multi-party transactions
- Ensures confidentiality of business information
- Prevents direct contact between principals bypassing intermediaries
- Standard protection agreement in commodity trading

**Irrevocable Master Fee Protection Agreement (IMFPA)**
- Legally guarantees payment of fees (commissions) to intermediaries (brokers)
- Ensures intermediaries are paid once the transaction closes
- Prevents intermediaries from being bypassed
- Crucial contract in international trade, especially for bulk commodities
- Protects all parties and ensures transparent fee distribution

### Contract Documents

**Master Service Agreement (MSA)**
- Framework agreement for ongoing relationship
- Covers multiple transactions

**Sales Purchase Agreement (SPA)**
- Specific contract for individual trade
- Legally binding contract

### Financial Documents

**Letter of Credit (LC)**
- Bank guarantee of payment
- Payment upon presentation of documents

### Shipping Documents

**Bill of Lading (BOL)**
- Issued by shipping carrier
- Receipt for goods and title document

**Certificate of Origin**
- Certifies country where goods were produced
- Required for customs

**Quality Certificate**
- Verifies product specifications
- Issued by inspection company

---

## Incoterms Reference

**FOB (Free On Board)**
- Seller delivers goods on board vessel
- Buyer pays freight and insurance

**CIF (Cost, Insurance, and Freight)**
- Seller pays freight and insurance to destination
- Popular for international sea freight

**CFR (Cost and Freight)**
- Similar to CIF but without insurance
- Seller pays freight, buyer arranges insurance

**DAP (Delivered At Place)**
- Seller delivers to named place
- Seller bears all risks until delivery

**DDP (Delivered Duty Paid)**
- Seller delivers goods cleared for import
- Maximum obligation for seller

---

## Support & Contact

For technical support or questions about the Fox Trade Master™ app:
- Email: support@foxtrademaster.com
- Phone: +1-804-506-9939
- Hours: 24/7 for critical issues

---

**End of User Manual**

*Fox Trade Master™ - Professional Commodity Trading Platform*
*Streamlining global commodity trade with confidence and compliance*`;

export default function UserManualScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Markdown style={markdownStyles}>
            {MANUAL_CONTENT}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});

const markdownStyles = {
  body: {
    color: '#E5E7EB',
  },
  heading1: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
  },
  heading2: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  heading3: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
  },
  heading4: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  strong: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  em: {
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet_list_icon: {
    color: '#3B82F6',
    marginRight: 8,
  },
  ordered_list_icon: {
    color: '#3B82F6',
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: '#1F2937',
    color: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 13,
  },
  code_block: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  fence: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  hr: {
    backgroundColor: '#374151',
    height: 1,
    marginVertical: 20,
  },
  blockquote: {
    backgroundColor: '#1F2937',
    borderLeftColor: '#3B82F6',
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
};
