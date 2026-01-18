import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

const MANUAL_CONTENT = `# Fox Trade Master™ Global Trading App
## User Manual

---

## Table of Contents
1. [Getting Started](#getting-started)
   - Demo Mode (Instant Access)
   - Create Account (Full Access)
   - Switching Between Modes
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

When you first open Fox Trade Master™, you'll see the welcome screen with:
- **Fox Trade Master™ Logo** - Circular logo at the top
- **Role Selection Cards** - Five professional roles to choose from
- **Try Demo Mode Button** - Green button at the bottom for instant access without sign-up

### Two Ways to Get Started

#### Option 1: Demo Mode (Instant Access)
**Perfect for:** Apple reviewers, evaluating the app, or exploring features without commitment

1. On the welcome screen, scroll down and tap **"Try Demo Mode"** (green button)
2. A modal appears with all available roles
3. Select the role you want to explore (e.g., Trade Originator, Compliance Officer, Risk Manager, Legal Reviewer, or Senior Management)
4. You'll instantly access the app with sample data
5. **Full functionality** - All features work in demo mode
6. **No account required** - Start using immediately
7. **No authentication** - Skip email/password setup

**Demo Mode Features:**
- ✅ Complete access to all role-specific features
- ✅ Pre-loaded sample trades, counterparties, and documents
- ✅ Test all workflows and approvals
- ✅ Experience the full app without creating an account
- ✅ Switch between roles anytime via Settings
- ⚠️ Data is not persisted across sessions
- ⚠️ Cannot connect to real bank accounts or external systems

#### Option 2: Create Account (Full Access)
**Perfect for:** Production use, real trading operations, persistent data storage

1. On the welcome screen, tap any **role card** that matches your position
2. An authentication modal appears
3. Choose **Sign Up** to create a new account:
   - Enter your full name
   - Enter your email address
   - Create a password
   - Tap **Sign Up**
4. Or choose **Sign In** if you already have an account:
   - Enter your email
   - Enter your password
   - Tap **Sign In**
5. You'll be authenticated and taken to your dashboard

**Authenticated Mode Features:**
- ✅ All demo mode features PLUS:
- ✅ Persistent data storage (your trades, documents, counterparties are saved)
- ✅ Multi-device sync via cloud
- ✅ Real email notifications and document sending
- ✅ Team collaboration with other users
- ✅ Data backup and recovery
- ✅ Production-ready workflows

### Demo Mode vs. Authenticated Mode

**When to Use Demo Mode:**
- ✅ Evaluating the app for the first time
- ✅ Apple App Store review process
- ✅ Testing features before committing
- ✅ Training new team members
- ✅ Quick demonstrations or presentations
- ✅ No need for persistent data

**When to Use Authenticated Mode:**
- ✅ Production trading operations
- ✅ Need to save and access data across sessions
- ✅ Team collaboration with multiple users
- ✅ Real document sending and notifications
- ✅ Compliance and audit trail requirements
- ✅ Long-term trade tracking and reporting

### Returning to Role Selection

If you need to switch roles or return to the welcome screen:

**From Demo Mode or Authenticated Mode:**
1. Tap the **Settings** tab in the bottom navigation
2. Scroll to the "General" section
3. Tap **"Change Role"** (red button with logout icon)
4. You'll return to the welcome screen with all role options
5. Select a different role or choose Demo Mode again

**Note:** 
- In Demo Mode: Changing roles resets to new sample data for that role
- In Authenticated Mode: Changing roles preserves your data but shows role-specific views
- You remain signed in when changing roles (doesn't log you out)

### Switching from Demo to Authenticated

1. While in Demo Mode, tap **Settings**
2. Tap **"Change Role"** to return to welcome screen
3. Select any role card to open authentication
4. Choose **Sign Up** to create your account
5. Your demo session data won't transfer (demo data is temporary)
6. Start fresh with your authenticated account

### Navigation

The app uses a tab-based navigation system with up to 7 main sections (varies by role):
- **Dashboard** - Overview of your portfolio and recent activity
- **Trades** - Manage all trading activities
- **Counterparties** - Manage business relationships (not available for Legal Reviewer)
- **Documents** - Upload, view, and send documents (not available for Risk Manager or Senior Management)
- **Market** - Directory of verified market participants (Trade Originator and Senior Management only)
- **Wallet** - Commission tracking and payments (Trade Originator and Senior Management only)
- **Settings** - Account settings, subscription, and app preferences (available to all roles)

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
   - **Commodity Type** - Select from Gold, Fuel Oil, Steam Coal, Anthracite Coal, Urea, or Edible Oils
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

Fox Trade Master™ supports 17 standard commodity trading documents. All documents are available as downloadable blank templates (editable Word .docx format) in the Documents tab.

### Available Document Templates (17 Total)

#### Pre-Trade Documents (10)

**1. Corporate Information Sheet (CIS)**
- Company details and credentials
- Business registration information
- Contact information and representatives
- Banking details
- Foundation document for establishing trade relationships

**2. Letter of Intent (LOI)**
- Buyer's preliminary interest in purchasing
- Non-binding expression of intent
- Includes approximate quantities and terms
- Starts negotiation process

**3. Soft Corporate Offer (SCO)**
- Seller's preliminary offer
- Outlines basic terms of sale
- Subject to final negotiation
- Non-binding commercial proposal

**4. Full Corporate Offer (FCO)**
- Seller's complete binding offer
- Detailed terms, specifications, and pricing
- Legally binding commercial offer
- More comprehensive and formal than SCO

**5. Irrevocable Corporate Purchase Order (ICPO)**
- Buyer's binding commitment to purchase
- Specific quantities, prices, and delivery terms
- Legally binding once accepted by seller
- Typically requires accompanying Proof of Funds

**6. Proof of Funds (POF)**
- Bank document verifying buyer has available funds
- Required for large transactions
- Shows financial capability to complete purchase
- Issued by buyer's bank to seller

**7. Ready, Willing, and Able Letter (RWA)**
- Bank confirmation of party's readiness to proceed
- Demonstrates willingness to transact
- Shows financial ability to fulfill obligations
- Often required before negotiations advance to contract stage

**8. Bank Comfort Letter (BCL)**
- Bank confirmation of client's financial standing
- Indicates bank's support for the transaction
- Provides financial assurance to counterparty
- Not a payment guarantee but shows creditworthiness

**9. Non-Circumvention Non-Disclosure Agreement (NCNDA)**
- Protects parties from being circumvented in multi-party transactions
- Ensures confidentiality of business information
- Prevents direct contact between principals bypassing intermediaries
- Standard protection agreement in commodity trading
- Must be signed by all parties involved in transaction chain

**10. Irrevocable Master Fee Protection Agreement (IMFPA)**
- Legally guarantees payment of fees/commissions to intermediaries (brokers)
- Ensures intermediaries are paid once transaction closes
- Prevents intermediaries from being bypassed
- Crucial contract in international trade, especially bulk commodities
- Protects all parties and ensures transparent fee distribution
- Legally binding and irrevocable fee protection structure

#### Contract Documents (3)

**11. Transaction Support Agreement (TSA)**
- Supporting agreement for complex multi-party transactions
- Defines roles and responsibilities of each party
- Coordinates logistics, documentation, and payments
- Ensures smooth transaction execution

**12. Sales and Purchase Agreement (SPA)**
- Primary binding contract for individual trade
- Detailed terms, quantities, quality specifications
- Delivery schedule and location
- Payment terms and conditions
- Legally enforceable sales contract

**13. Assignment of Sale with Product (ASWP)**
- Transfer of sales rights and obligations to third party
- Assigns product delivery rights
- Common in commodity trading chains with multiple intermediaries
- Legally transfers seller's contractual position

#### Financial & Shipping Documents (4)

**14. 2% Performance Bond (POP)**
- Performance guarantee equal to 2% of contract value
- Ensures seller fulfills contractual obligations
- Provides buyer security against non-performance or default
- Typically issued by bank or insurance company
- Released upon successful delivery and acceptance

**15. Bill of Lading (BOL)**
- Issued by shipping carrier/freight forwarder
- Serves as receipt for goods shipped
- Acts as title document for cargo ownership
- Required for customs clearance at destination
- Types: Ocean BOL, Master BOL, House BOL, Negotiable BOL

**16. Certificate of Origin (COO)**
- Certifies country where goods were produced/manufactured
- Required for customs clearance and duty calculation
- May affect import tariffs and trade preferences
- Issued by chamber of commerce or authorized trade authority
- Essential for preferential trade agreements (FTA benefits)

**17. Quality Certificate**
- Verifies product specifications and quality standards
- Issued by independent inspection companies (SGS, Bureau Veritas, Intertek)
- Documents test results against contract specifications
- Essential for buyer acceptance and payment release
- Required for most commodity transactions

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
- Phone: +1-804-825-9037
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
