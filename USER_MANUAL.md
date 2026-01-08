# Fox Trade Master™ Global Trading App
## User Manual

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Role Selection](#role-selection)
3. [User Roles & Responsibilities](#user-roles--responsibilities)
4. [Dashboard Overview](#dashboard-overview)
5. [Managing Trades](#managing-trades)
6. [Managing Counterparties](#managing-counterparties)
7. [Document Management](#document-management)
8. [Market Directory](#market-directory)
9. [Advanced Market Features](#advanced-market-features)
10. [Importing Market Participants](#importing-market-participants)
11. [Understanding Risk Levels](#understanding-risk-levels)
12. [Trade Workflow](#trade-workflow)
13. [Document Types](#document-types)

---

## Getting Started

### Authentication & Login

Fox Trade Master™ uses secure, password-free authentication via magic links.

#### Signing In
1. Open the Fox Trade Master™ app
2. You'll see the login screen with the app logo
3. Enter your email address in the email field
4. Tap **"Send Magic Link"**
5. Check your email inbox for the magic link
6. Click the link in the email (valid for 60 minutes)
7. You'll be automatically signed in and redirected to the app

#### Magic Link Benefits
- **No Password Required** - No need to remember or manage passwords
- **More Secure** - Each link is unique and expires after use
- **Quick Access** - One click from your email to sign in
- **Works Everywhere** - Sign in from any device with your email

#### Troubleshooting Login

**Email Not Received**:
- Check your spam/junk folder
- Verify you entered the correct email address
- Wait a few minutes for email delivery
- Tap "Use different email" to try again
- Contact support if issues persist

**Magic Link Expired**:
- Links expire after 60 minutes for security
- Return to login screen and request a new link
- Check your email more quickly next time

**Email Service Issues**:
- If you see an email configuration message, the service may be undergoing maintenance
- Contact support at support@foxtrademaster.com or +1-804-506-9939
- Service is typically restored within a few hours

### First Launch & Role Selection

When you first open Fox Trade Master™, you'll be greeted with the welcome screen featuring:
- **Fox Trade Master™ Logo** - Circular logo displayed prominently at the top
- **App Title** - "Fox Trade Master™" and "Global Trading App" subtitle
- **Role Selection Cards** - Choose your role to access the appropriate features

#### Selecting Your Role
1. Review the available roles displayed as cards
2. Each role card shows:
   - **Icon** - Visual representation of the role
   - **Title** - Role name (e.g., Trade Originator, Compliance Officer)
   - **Description** - Brief explanation of responsibilities
3. Tap the role card that matches your position
4. You'll be taken directly to the main dashboard

### Navigation
The app uses a tab-based navigation system with 6 main sections:
- **Dashboard** - Overview of your portfolio and recent activity
- **Trades** - Manage all trading activities
- **Counterparties** - Manage business relationships
- **Documents** - Upload, view, and send documents
- **Market** - Directory of verified market participants
- **Settings** - Manage account, subscription, and app preferences

### Accessing the User Manual
- Tap the **Help icon (?)** in the top right of the Dashboard
- Or go to **Settings** tab and select **"User Manual"**
- Access comprehensive documentation about all features
- Search for specific topics and instructions

### Changing Your Role

If you need to switch to a different role or return to the role selection screen:

1. **Navigate to Settings**:
   - Tap the **Settings** tab in the bottom navigation

2. **Access Change Role**:
   - Scroll to the "General" section
   - Tap **"Change Role"** (red button with logout icon)

3. **Return to Role Selection**:
   - You'll be immediately returned to the welcome screen
   - The Fox Trade Master™ logo and role cards will be displayed
   - Select a new role to continue

**Note**: Changing your role does not log you out or clear your data. It simply allows you to access the app with a different role's permissions and view.

---

## User Roles & Responsibilities

Fox Trade Master™ provides role-based access control to ensure each team member has the appropriate tools and information for their responsibilities. Each role has a customized experience with specific features, metrics, and access levels.

### Available Roles

#### 1. Trade Originator
**Primary Responsibility**: Create and manage trades

**Dashboard Metrics**:
- Total Portfolio Value
- Commission Earned
- Potential Commission
- Active Trades

**Access & Features**:
- ✅ **Full access** to all tabs: Dashboard, Trades, Counterparties, Documents, Market, Wallet, Settings
- ✅ **Create new trades** via the "+" button
- ✅ **Import trades** from CSV/Excel files
- ✅ **Import counterparties** from external sources
- ✅ **Access market directory** to find new trading partners
- ✅ **Manage wallet** and view commissions
- ✅ View all trade statuses and documents

**Key Workflows**:
1. Create and submit new trades
2. Monitor trade progress through all stages
3. Track commission earnings
4. Build counterparty relationships
5. Access verified market participants

#### 2. Compliance Officer
**Primary Responsibility**: Ensure regulatory compliance

**Dashboard Metrics**:
- Compliance Reviews Needed (primary metric)
- Critical Alerts
- Approved Counterparties
- Unresolved Issues

**Access & Features**:
- ✅ **Access**: Dashboard, Trades, Counterparties, Documents, Settings
- ✅ **Focused view** on trades requiring compliance checks
- ✅ **Review counterparty** documentation and risk scores
- ✅ **Monitor alerts** and resolve compliance issues
- ✅ **Approve/reject** counterparties based on compliance standards
- ❌ Cannot create new trades
- ❌ No access to Market directory or Wallet

**Key Workflows**:
1. Review trades in "compliance_check" status
2. Verify counterparty compliance documentation
3. Monitor and resolve critical alerts
4. Approve counterparties meeting compliance standards
5. Track unresolved compliance issues

**Trade Status Filters**:
- All
- Compliance Check
- Counterparty Review
- Risk Approval
- Legal Review

#### 3. Risk Manager
**Primary Responsibility**: Assess counterparty risk

**Dashboard Metrics**:
- Risk Approvals Needed (primary metric)
- High Risk Trades (Red)
- Medium Risk Trades (Amber)
- Low Risk Trades (Green)

**Access & Features**:
- ✅ **Access**: Dashboard, Trades, Counterparties, Settings
- ✅ **Risk-focused dashboard** showing trade risk distribution
- ✅ **Review trades** requiring risk approval
- ✅ **Assess counterparty** risk scores
- ✅ **Monitor risk levels** across all active trades
- ❌ Cannot create new trades
- ❌ No access to Documents, Market directory, or Wallet

**Key Workflows**:
1. Review trades in "risk_approval" status
2. Evaluate counterparty risk scores
3. Assess trade risk levels (green/amber/red)
4. Monitor high-risk trade exposure
5. Approve or flag trades based on risk assessment

**Trade Status Filters**:
- All
- Risk Approval
- Counterparty Review
- Active
- Financing Pending

**Risk Score Components**:
- Legal/Licensing (0-100)
- Financial Strength (0-100)
- Compliance/Sanctions (0-100)
- Operations/Logistics (0-100)
- Commodity-Specific (0-100)
- Overall Score & Level (Green/Amber/Red)

#### 4. Legal Reviewer
**Primary Responsibility**: Review contracts and agreements

**Dashboard Metrics**:
- Legal Reviews Needed (primary metric)
- Pending Documents
- Verified Contracts
- Active Trades

**Access & Features**:
- ✅ **Access**: Dashboard, Trades, Documents, Settings
- ✅ **Legal-focused view** of trades requiring review
- ✅ **Document management** - upload, verify, and manage contracts
- ✅ **Review trade documents** (LOI, SPA, MSA, LC, etc.)
- ✅ **Verify document** authenticity and completeness
- ❌ Cannot create new trades
- ❌ No access to Counterparties, Market, or Wallet

**Key Workflows**:
1. Review trades in "legal_review" status
2. Verify contract documents
3. Check document completeness and validity
4. Flag missing or unverified documents
5. Approve trades with complete legal documentation

**Trade Status Filters**:
- All
- Legal Review
- Compliance Check
- Counterparty Review

**Document Types Reviewed**:
- Letter of Intent (LOI)
- Sales & Purchase Agreement (SPA)
- Master Framework Purchase Agreement (MFPA)
- Letter of Credit (LC)
- Bill of Lading (BOL)
- Certificate of Origin
- Quality Certificates

#### 5. Senior Management
**Primary Responsibility**: Oversee operations and strategy

**Dashboard Metrics**:
- Total Portfolio Value (primary metric)
- Total Commission Earned
- Active Trades
- Pending Approvals
- Critical Alerts
- Approved Counterparties

**Access & Features**:
- ✅ **Full access** to: Dashboard, Trades, Counterparties, Market, Wallet, Settings
- ✅ **Executive dashboard** with comprehensive metrics
- ✅ **Create new trades** and strategic partnerships
- ✅ **View financial performance** and commission tracking
- ✅ **Monitor critical alerts** and pending approvals
- ✅ **Access market directory** for business development
- ✅ **Strategic overview** of all operations
- ❌ No direct access to Documents tab (delegates to Legal team)

**Key Workflows**:
1. Monitor overall portfolio performance
2. Review high-value trades and strategic decisions
3. Track commission earnings and profitability
4. Oversee critical alerts and risk exposure
5. Approve strategic counterparty relationships
6. Business development through market directory

**Trade Status Filters**:
- All
- Active
- In Transit
- Delivered
- Settled

### Role-Based Dashboard Customization

Each role sees a customized dashboard designed for their specific needs:

**Trade Originator & Senior Management**:
- Focus on financial metrics (portfolio value, commissions)
- "+" button visible for creating new trades
- Comprehensive trade pipeline view
- Access to wallet and payment features

**Compliance Officer**:
- Focus on compliance metrics and alerts
- Highlighted pending compliance reviews
- Unresolved issues tracker
- Counterparty approval status

**Risk Manager**:
- Focus on risk distribution (green/amber/red)
- Risk approval queue
- Trade risk level breakdown
- High-risk trade monitoring

**Legal Reviewer**:
- Focus on document status
- Legal review queue
- Pending documents tracker
- Contract verification status

### Role-Based Navigation

The tab bar dynamically adjusts based on your role, showing only relevant sections:

| Tab | Trade Originator | Compliance Officer | Risk Manager | Legal Reviewer | Senior Management |
|-----|-----------------|-------------------|--------------|----------------|------------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Trades | ✅ | ✅ | ✅ | ✅ | ✅ |
| Counterparties | ✅ | ✅ | ✅ | ❌ | ✅ |
| Documents | ✅ | ✅ | ❌ | ✅ | ❌ |
| Market | ✅ | ❌ | ❌ | ❌ | ✅ |
| Wallet | ✅ | ❌ | ❌ | ❌ | ✅ |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ |

### Switching Between Roles

To experience the app from a different role perspective:

1. Go to **Settings** tab
2. Tap **"Change Role"** in the General section
3. Select a new role from the welcome screen
4. Your dashboard and available features will update immediately

**Use Cases for Role Switching**:
- **Training**: Understand how other team members use the system
- **Testing**: Verify workflows from different perspectives
- **Coverage**: Temporarily handle responsibilities when colleagues are unavailable
- **Multi-role positions**: If you serve multiple functions in your organization

### Best Practices by Role

**Trade Originators**:
- Create detailed trade entries with complete information
- Upload all required documents before submission
- Monitor trade status and respond to review requests
- Track commission potential and payment timing

**Compliance Officers**:
- Review new counterparties within 24-48 hours
- Maintain up-to-date compliance documentation
- Resolve alerts promptly to avoid trade delays
- Document all compliance decisions and conditions

**Risk Managers**:
- Assess counterparty risk scores thoroughly
- Set appropriate risk levels based on standardized criteria
- Monitor portfolio risk concentration
- Flag trades exceeding risk thresholds

**Legal Reviewers**:
- Verify all contracts before trade execution
- Ensure document completeness and accuracy
- Maintain version control of legal documents
- Flag any non-standard terms or conditions

**Senior Management**:
- Review weekly portfolio performance metrics
- Monitor critical alerts and high-risk trades
- Approve strategic counterparty relationships
- Track commission earnings and profitability trends

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

### Viewing Trade Details
1. Tap any trade card to view full details
2. Trade detail screen shows:
   - Complete trade information
   - Counterparty details and risk score
   - Documents attached to the trade
   - Delivery timeline
   - Approval history
   - Active alerts
   - Communication log

### Trade Actions
Depending on your role and trade status, you can:
- **Approve/Reject** - Move trade to next stage or reject
- **Add Documents** - Attach contracts, letters of credit, bills of lading
- **Update Status** - Mark milestones (shipped, delivered, etc.)
- **Add Notes** - Internal communication about the trade

---

## Managing Counterparties

### Viewing Counterparties
1. Tap the **Counterparties** tab
2. View all business relationships
3. Each counterparty card shows:
   - Company name and location
   - Type (Buyer or Seller)
   - Approval status icon
   - Risk score and level
   - Detailed risk breakdown (Legal, Financial, Compliance, Operations)
   - Approval conditions (if any)
   - Number of documents on file
   - Onboarding date

### Searching Counterparties
Use the search bar to find counterparties by:
- Company name
- Country

### Understanding Risk Scores

Each counterparty has multiple risk dimensions:

#### Legal & Licensing (Score 0-100)
- Company registration verification
- Business licenses
- Legal entity structure
- Litigation history

#### Financial Strength (Score 0-100)
- Bank references
- Financial statements
- Credit rating
- Payment history

#### Compliance & Sanctions (Score 0-100)
- Sanctions screening (OFAC, EU, UN)
- Anti-money laundering checks
- Politically exposed persons (PEP) screening
- Adverse media screening

#### Operations & Logistics (Score 0-100)
- Track record of deliveries
- Logistics capabilities
- Quality of goods delivered
- Operational reliability

#### Overall Risk Score
Combined score determining the risk level:
- **Green (80-100)** - Low risk, approved for trading
- **Amber (50-79)** - Medium risk, conditional approval or additional scrutiny
- **Red (0-49)** - High risk, trading not recommended

### Counterparty Status
- **Pending DDQ** - Due diligence questionnaire pending
- **Under Review** - Risk assessment in progress
- **Approved** - Cleared for trading
- **Rejected** - Not approved for trading

### Viewing Counterparty Details
1. Tap any counterparty card
2. View complete profile including:
   - Full risk assessment
   - All uploaded documents
   - Trade history
   - Approval conditions
   - Contact information
   - Due diligence notes

---

## Document Management

### Viewing Documents
1. Tap the **Documents** tab
2. View all documents from trades and counterparties
3. Documents are sorted by upload date (most recent first)
4. Each document shows:
   - Document type and icon
   - Document name
   - Source (Trade or Counterparty)
   - Verification status
   - Upload date and uploader
   - Download option

### Document Statistics
Top of screen shows:
- **Verified** - Documents that have been reviewed and approved
- **Pending** - Documents awaiting verification

### Uploading Documents

#### Quick Upload Method
1. Scroll to "Quick Upload" section
2. Select a trade or counterparty
3. Choose upload method:
   - **Scan Document** - Use camera to scan physical documents
   - **Choose File** - Select PDF, DOC, or image from device
   - **From Gallery** - Pick image from photo library
4. Document uploads to Supabase storage
5. Document appears in the list

#### Upload from Trade/Counterparty
1. View trade or counterparty details
2. Tap "Upload Document"
3. Follow same upload process

### Sending Trade Documents

The app can generate and send standard commodity trading documents:

#### Available Document Types
- **CIS** (Commercial Invoice Specification)
- **SCO** (Soft Corporate Offer)
- **ICPO** (Irrevocable Corporate Purchase Order)
- **LOI** (Letter of Intent)
- **POF** (Proof of Funds)

#### How to Send Documents
1. Tap the **Send icon** (top right of Documents screen)
2. Select the trade
3. Choose document type (CIS, SCO, ICPO, LOI, or POF)
4. Enter recipient email address
5. Review trade details
6. Tap "Send Document"
7. Document is generated and emailed via SendGrid

### Document Types Reference

#### Corporate Documents
- Articles of incorporation
- Business registration
- Certificates of good standing

#### Licenses
- Trading licenses
- Import/export licenses
- Commodity-specific permits

#### Financial Statements
- Balance sheets
- Income statements
- Cash flow statements

#### Bank References
- Bank comfort letters
- Account verification
- Credit facilities

#### Trade Documents
- **LOI** - Letter of Intent expressing interest to trade
- **POF** - Proof of Funds showing financial capability
- **MSA** - Master Service Agreement (framework contract)
- **SPA** - Sales Purchase Agreement (specific transaction)
- **LC** - Letter of Credit from bank
- **BOL** - Bill of Lading (shipping document)
- **Certificate of Origin** - Country of origin certification
- **Quality Certificate** - Product quality verification

---

## Market Directory

### Overview
The Market Directory contains verified market participants including trading houses, brokers, and platforms.

### Statistics
- Total verified participants
- Number of trading houses
- Number of brokers
- Number of platforms

### Searching the Directory
Use the search bar to find participants by:
- Company name
- Description
- Location

### Filtering Options

#### By Type
- **All** - Show all participants
- **Trading Houses** - Physical commodity traders
- **Brokers** - FCMs, physical brokers, bullion banks
- **Platforms** - Exchanges, clearing houses, market platforms

#### By Commodity
Filter to see only participants dealing in specific commodities:
- All Commodities
- Gold
- Fuel Oil
- Steam Coal
- Anthracite Coal
- Urea

### Viewing Participant Details
1. Tap any participant card
2. Full detail modal shows:
   - Company description
   - Headquarters and global offices
   - Commodities traded
   - Licenses and regulatory compliance
   - Trading volume (if disclosed)
   - Founded date
   - Website

#### Trading House Details
- Specialization
- Global office locations
- Trading categories (Energy & Fuels, Coal, Precious Metals, etc.)
- Licenses and compliance certifications
- Annual trading volume

#### Broker Details
- Broker type (FCM, Physical Broker, Bullion Bank, Clearing Member)
- Regulatory authorities (CFTC, FCA, MAS, SEC, NFA, etc.)
- License numbers for each authority
- Clearing relationships
- Commodities covered

#### Platform Details
- Framework (Exchange, Clearing House, Market Platform)
- Key members
- Operational structure
- Regulatory oversight

### Using Market Directory
- **Research counterparties** before trading
- **Verify legitimacy** of trading partners
- **Find brokers** for specific commodities
- **Identify platforms** for market access
- **Check regulatory status** of market participants

### Filtering by Business Type

When viewing the Market Directory, you can filter companies by their business type:

1. **Access Business Type Filter**:
   - Located below the commodity filter chips
   - Filter options: All, Buyers, Sellers, Both

2. **Filter Options**:
   - **All** - Shows all companies regardless of type
   - **Buyer** - Shows only companies that purchase commodities
   - **Seller** - Shows only companies that sell commodities
   - **Both** - Shows companies that both buy and sell

3. **Combined Filtering**:
   - Combine commodity + business type filters for precise results
   - Example: "Gold" + "Buyers" = All gold purchasing companies
   - Example: "Edible Oils" + "Sellers" = All edible oils producers/sellers

4. **Industry Sections**:
   - Each commodity has dedicated Buyers and Sellers sections
   - Navigate between sections to find the right type of partner
   - Useful for targeted outreach and partner identification

---

## Advanced Market Features

### Email Outreach Tool

The Email Outreach Tool allows you to compose and send professional emails to multiple companies directly from the platform.

#### How to Use Email Outreach
1. Navigate to the **Market** tab
2. Tap the **Email icon** in the top right corner
3. The Email Outreach modal opens

#### Composing Your Email
1. **Select Companies**: Choose one or multiple companies from your search results
   - Use checkboxes to select multiple recipients
   - Selected companies appear in the recipient list

2. **Choose Template**: Select from pre-built templates:
   - **RFQ (Request for Quote)** - Inquire about pricing and availability
   - **Partnership Inquiry** - Express interest in business partnership
   - **Market Information** - Request general market information
   - **Custom** - Write your own email from scratch

3. **Customize Content**:
   - Subject line
   - Email body with template variables
   - Your contact information
   - Company signature

4. **Review Recipients**: Verify all selected companies before sending

5. **Send**: Tap "Send Email" to dispatch to all selected companies

#### Email Templates

**RFQ Template**:
```
Subject: Request for Quote - [Your Company]

Dear [Company Name],

We are interested in purchasing [commodity] and would like to request a quote for:
- Product: [commodity]
- Quantity: [amount]
- Delivery terms: [incoterm]
- Delivery window: [timeframe]

Please provide your best pricing and availability.

Best regards,
[Your details]
```

**Partnership Inquiry Template**:
```
Subject: Business Partnership Opportunity

Dear [Company Name],

We are exploring potential partnerships in the [commodity] market and believe there may be synergies between our organizations.

We would welcome the opportunity to discuss potential collaboration.

Best regards,
[Your details]
```

#### Email Features
- Send to multiple companies simultaneously
- Professional templates for different scenarios
- Automatic company name insertion
- Track sent emails (in your email client)
- Include your company branding and signature

---

### Company Verification Badges

Verification badges provide trust indicators to help you assess company reliability and responsiveness.

#### Understanding Verification Badges

Each company in the Market Directory displays verification information:

1. **Verification Status**
   - ✓ **Verified** - Company has been verified by the platform
   - **Pending** - Verification in progress
   - **Unverified** - No verification completed

2. **Verification Date**
   - Shows when the company was last verified
   - Format: "Verified Dec 2025"
   - Recent verification indicates up-to-date information

3. **Last Contact Update**
   - When contact information was last confirmed
   - Helps ensure you're reaching active companies
   - Format: "Updated 2 weeks ago"

4. **Response Rate**
   - Percentage showing how often company responds to inquiries
   - Based on community feedback and outreach history
   - Color-coded:
     - **Green (80-100%)** - Highly responsive
     - **Amber (50-79%)** - Moderately responsive
     - **Red (0-49%)** - Low response rate

#### Using Verification Information

**Prioritize Outreach**:
- Focus on companies with high response rates
- Verified companies are more reliable
- Recently updated contacts are more likely to be accurate

**Risk Assessment**:
- Combine verification badges with risk scores
- Verified + high response rate = reliable partner
- Unverified + low response rate = proceed with caution

**Example Badge Display**:
```
✓ Verified Dec 2025
📅 Updated 1 week ago
📊 Response Rate: 85% (Green)
```

---

### Saved Searches Feature

Save your frequently used search and filter combinations for instant access.

#### Creating a Saved Search

1. **Set Your Filters**:
   - Navigate to Market Directory
   - Apply desired filters (commodity, type, location, etc.)
   - Enter search terms if needed
   - Configure any advanced filters

2. **Save the Search**:
   - Tap the **Star icon** (Save Search) in the top right
   - The Saved Searches modal opens

3. **Name Your Search**:
   - Enter a descriptive name (e.g., "Premium Asian Producers")
   - Examples:
     - "US Fuel Oil Brokers"
     - "Gold Trading Houses - London"
     - "Verified Coal Sellers"
     - "High Response Urea Buyers"

4. **Save**: Tap "Save Search" to store

#### Using Saved Searches

1. **Access Saved Searches**:
   - Tap the **Star icon** in Market Directory
   - View list of all saved searches

2. **Apply a Saved Search**:
   - Tap any saved search name
   - Filters and search terms are automatically applied
   - Results update instantly

3. **Manage Saved Searches**:
   - **Rename** - Update the search name
   - **Delete** - Remove searches you no longer need
   - **Update** - Modify filters and re-save

#### Saved Search Examples

**"Premium Asian Producers"**:
- Type: Trading Houses
- Location: Singapore, Hong Kong, UAE
- Response Rate: >80%
- Verification: Verified only

**"Emergency Fuel Supply"**:
- Commodity: Fuel Oil
- Response Rate: >90%
- Location: Within 500 miles

**"New Market Opportunities"**:
- Verification Date: Last 30 days
- Type: All
- Sorted by: Response rate (high to low)

#### Benefits
- **Time Saving** - No need to re-apply filters repeatedly
- **Consistency** - Use same criteria across sessions
- **Efficiency** - Quick access to specific market segments
- **Organization** - Keep track of different market research angles

---

### Company Ratings & Reviews System

Rate your experience with buyers and producers to help the community identify reliable partners.

#### Rating Companies

1. **Access Company Profile**:
   - Tap any company in Market Directory
   - Scroll to "Rate This Company" section

2. **Provide Your Rating**:
   - **Overall Rating** (1-5 stars)
   - **Communication** - Responsiveness and clarity
   - **Reliability** - Delivery and commitment adherence
   - **Quality** - Product quality and accuracy
   - **Payment** - Payment terms and timeliness (for buyers)

3. **Write a Review** (Optional):
   - Share specific experiences
   - Mention positives and challenges
   - Help others make informed decisions
   - Keep reviews professional and factual

4. **Verification**:
   - Only verified users can leave reviews
   - Reviews linked to actual trades are marked "Verified Trade"
   - Anonymous reviews not permitted (maintains accountability)

#### Understanding Ratings Display

Each company shows:

**Average Rating**:
```
★★★★☆ 4.2/5.0 (based on 47 reviews)
```

**Breakdown by Category**:
- Communication: ★★★★★ 4.8/5
- Reliability: ★★★★☆ 4.1/5
- Quality: ★★★★☆ 4.0/5
- Payment: ★★★★☆ 4.3/5

**Recent Reviews**:
- Displays 3 most recent reviews
- Shows reviewer name, date, rating, and comment
- "Verified Trade" badge for trade-based reviews

#### Rating Guidelines

**5 Stars - Exceptional**:
- Exceeded expectations
- Excellent communication and reliability
- Would highly recommend

**4 Stars - Good**:
- Met expectations
- Minor issues handled professionally
- Would work with again

**3 Stars - Acceptable**:
- Mixed experience
- Some concerns but trade completed
- Proceed with standard caution

**2 Stars - Poor**:
- Significant issues
- Communication or delivery problems
- Increased monitoring recommended

**1 Star - Unacceptable**:
- Failed to meet obligations
- Major disputes or losses
- Not recommended for trading

#### Benefits of Ratings System

**For Buyers**:
- Identify most reliable suppliers
- Avoid problematic partners
- Community-verified quality

**For Sellers**:
- Showcase reputation
- Build trust with new partners
- Demonstrate track record

**For Community**:
- Collective intelligence
- Reduced risk through shared experiences
- Market transparency

#### Review Moderation

- All reviews monitored for inappropriate content
- Fake or malicious reviews removed
- Companies can respond to reviews
- Dispute resolution available for contested reviews

---

### Advanced Search with Auto-Complete

Intelligent search that suggests companies, regions, and oil types as you type.

#### How Auto-Complete Works

1. **Start Typing**:
   - Enter search terms in the Market Directory search bar
   - Suggestions appear automatically after 2 characters

2. **Suggestion Categories**:

   **Companies**:
   - Matches company names
   - Shows company type (Trading House, Broker, Platform)
   - Displays primary commodity
   - Example: "Trafigura - Trading House (Multi-commodity)"

   **Regions**:
   - Country names
   - Major cities
   - Trading hubs
   - Example: "Singapore (Hub - 45 companies)"

   **Commodities & Oil Types**:
   - Commodity categories
   - Specific oil grades
   - Niche products
   - Example: "Fuel Oil - High Sulfur (23 suppliers)"

3. **Select Suggestion**:
   - Tap any suggestion to apply
   - Search results update instantly
   - Relevant filters auto-applied

#### Search Intelligence Features

**Fuzzy Matching**:
- Handles typos and misspellings
- "trafigyra" → suggests "Trafigura"
- "sngapore" → suggests "Singapore"

**Synonym Recognition**:
- "Brokers" also matches "FCM", "Intermediaries"
- "Fuel" also matches "Petroleum", "Oil Products"

**Context-Aware**:
- Learns from your search patterns
- Prioritizes suggestions based on:
  - Your previous searches
  - Your commodity focus
  - Your regional preferences

**Multi-Field Search**:
- Searches across:
  - Company names
  - Descriptions
  - Locations
  - Commodities
  - Licenses
  - Tags

#### Advanced Search Tips

**Combining Terms**:
- Use spaces for AND logic
- "Singapore fuel" → companies in Singapore dealing with fuel

**Specific Searches**:
- Company names: Direct match prioritized
- Regions: "companies in [region]"
- Commodities: "[commodity] suppliers/buyers"

**Quick Filters**:
- Type "verified" to see only verified companies
- Type "high response" for companies with >80% response rate
- Type "new" for recently added companies

#### Search Performance

- **Instant Results** - Sub-100ms response time
- **Live Updates** - Results update as you type
- **Smart Ranking** - Most relevant results first
- **Cached Suggestions** - Common searches load instantly

---

### Custom Reports Builder

Generate professional, branded PDF reports combining company data, comparisons, and analytics.

#### Creating a Report

1. **Access Report Builder**:
   - Tap the **Report icon** (top right in Market Directory)
   - The Reports modal opens

2. **Select Companies**:
   - Choose companies to include in report
   - Select from:
     - Current search results
     - Saved searches
     - Individual company selection
   - Maximum 20 companies per report

3. **Choose Report Type**:

   **Supplier Comparison Report**:
   - Side-by-side comparison of multiple suppliers
   - Includes pricing, reliability ratings, verification status
   - Best for: Procurement decisions

   **Market Overview Report**:
   - Comprehensive view of market segment
   - Statistics and trends
   - Company listings with key details
   - Best for: Market research, stakeholder briefings

   **Due Diligence Report**:
   - Detailed company profiles
   - Risk assessment data
   - Verification details and ratings
   - Best for: Compliance review, risk assessment

   **Custom Report**:
   - Select specific data fields to include
   - Customize layout and sections
   - Add your own commentary
   - Best for: Specialized analysis

4. **Customize Report**:

   **Branding**:
   - Add your company logo
   - Choose color scheme
   - Include company information

   **Sections to Include**:
   - ☑ Company summaries
   - ☑ Verification badges and ratings
   - ☑ Contact information
   - ☑ Commodity focus areas
   - ☑ Comparison tables
   - ☑ Risk scores
   - ☑ Response rate analytics
   - ☑ Geographic distribution
   - ☑ Market statistics

   **Additional Options**:
   - Include/exclude unverified companies
   - Sort order (rating, alphabetical, response rate)
   - Date range for data
   - Add executive summary

5. **Generate Report**:
   - Tap "Generate PDF"
   - Report builds in 5-10 seconds
   - Preview available before download

6. **Share Report**:
   - Download PDF to device
   - Share via email
   - Export to cloud storage
   - Print directly

#### Report Sections

**Executive Summary**:
- Key findings and recommendations
- Market overview statistics
- Top-rated companies

**Company Profiles**:
- Full company details
- Ratings and reviews summary
- Verification status
- Contact information

**Comparison Tables**:
- Side-by-side data comparison
- Rating comparisons
- Response rate analysis
- Geographic presence

**Market Analytics**:
- Distribution charts (by region, commodity, type)
- Average ratings by category
- Response rate trends
- Verification statistics

**Appendix**:
- Methodology notes
- Data sources
- Glossary of terms
- Disclaimers

#### Report Use Cases

**Internal Team Sharing**:
- Present market research to management
- Share supplier options with procurement team
- Distribute to regional offices

**Stakeholder Communication**:
- Board presentations
- Investor updates
- Partner briefings

**Due Diligence Documentation**:
- Compliance records
- Audit trail for partner selection
- Risk committee reviews

**Client Proposals**:
- Demonstrate market knowledge
- Present sourcing options
- Competitive analysis

#### Report Features

**Professional Formatting**:
- Clean, branded design
- Clear data visualization
- Easy-to-read tables and charts

**Data Accuracy**:
- Real-time data at time of generation
- Timestamp on all reports
- Data source citations

**Customization**:
- Flexible layout options
- Include/exclude sections
- Add custom commentary
- Choose data fields

**Export Options**:
- PDF (primary format)
- CSV (data export)
- Email attachment
- Cloud storage integration

#### Report Best Practices

1. **Define Purpose**: Know what decision the report will support
2. **Select Relevant Companies**: Include only pertinent organizations
3. **Keep Updated**: Generate reports with current data when needed
4. **Add Context**: Include executive summary with key insights
5. **Verify Data**: Double-check critical information before sharing
6. **Brand Professionally**: Use consistent branding for external reports
7. **Control Distribution**: Limit sharing of sensitive competitive intelligence

---

## Importing Market Participants

The import feature allows you to bulk upload market participants (buyers, sellers, producers) from spreadsheet files.

### Supported File Formats
- **CSV** (.csv)
- **Excel** (.xlsx, .xls)

### How to Import Market Participants

#### Step 1: Access Import Feature
1. Navigate to the **Market** tab
2. Tap the **More icon (⋮)** in the top right corner
3. Select **"Import Market Participants"** from the actions menu

#### Step 2: Choose Your File
1. The Import Modal opens
2. Tap **"Choose File"** button
3. Select your CSV or Excel file from your device
4. The app will automatically parse the file and detect columns

#### Step 3: Select Industry Category

Before mapping columns, you must specify where these participants should be categorized:

**Commodity Type** - Select the industry:
- Gold
- Fuel Oil
- Steam Coal
- Anthracite Coal
- Urea
- Edible Oils

**Business Type** - Select the participant type:
- **Buyer** - Places these companies in the "Buyers" section for the selected commodity
- **Seller** - Places these companies in the "Sellers" section for the selected commodity
- **Both** - Company acts as both buyer and seller

**Example Categories:**
- Gold Buyers → Commodity: Gold, Business Type: Buyer
- Fuel Oil Sellers → Commodity: Fuel Oil, Business Type: Seller
- Edible Oils Producers → Commodity: Edible Oils, Business Type: Seller

#### Step 4: Map Your Columns

The app will attempt to automatically match your file columns to required fields. Review and adjust the mappings:

**Required Fields** (marked with "Required" badge):
- **Company Name** - Name of the organization
- **Country/Headquarters** - Location of company headquarters

**Optional Fields** (can be skipped):
- **Address** - Full street address
- **Phone** - Contact phone number
- **Email** - Contact email address
- **Website** - Company website URL
- **Contact Person** - Primary contact name
- **Products/Commodities** - Products or commodities they deal with
- **Company Type** - Trading house, broker, platform, etc.

**How to Map:**
1. Each target field shows a horizontal list of your file's column headers
2. Tap the column header from your file that matches the target field
3. Selected columns are highlighted in blue
4. To skip a field, select "Skip"
5. The app auto-suggests matches based on column names

#### Step 5: Preview Your Data

Before importing:
1. Expand the **"Data Preview"** section (tap to expand/collapse)
2. Review the first 5 rows of your data
3. Verify the data looks correct
4. Check that values are in the right columns
5. The preview shows total rows that will be imported

#### Step 6: Import

1. Ensure all **Required** fields are mapped
2. The import button shows: **"Import [X] rows"**
3. Tap **"Import"** to complete the process
4. Imported companies appear immediately in the Market Directory
5. They are automatically filtered by your selected commodity and business type

### Import Tips & Best Practices

#### Preparing Your File

**File Structure:**
- First row should contain column headers
- Each subsequent row represents one company
- Remove empty rows from the file
- Use consistent formatting

**Recommended Columns:**
```
Company Name | Country | Address | Phone | Email | Website | Contact Person | Products
```

**Example Data:**
```
ABC Trading Ltd | Singapore | 123 Main St | +65-1234-5678 | info@abc.com | www.abc.com | John Smith | Gold, Silver
XYZ Brokers | UAE | 456 Market Rd | +971-9876-5432 | contact@xyz.ae | www.xyz.ae | Sarah Lee | Fuel Oil
```

#### Data Quality Tips

1. **Company Names**: Use full legal names or common trading names
2. **Countries**: Use full country names ("United States" not "US")
3. **Phone Numbers**: Include country codes (e.g., +1, +65, +971)
4. **Emails**: Verify email addresses are valid
5. **Websites**: Include full URLs (https://www.example.com)

#### Handling Large Files

- **Recommended**: Import in batches of 100-200 companies
- **Maximum**: 1,000 rows per import
- **Performance**: Smaller files map and import faster
- **Organization**: Split large files by commodity or region

#### Common Import Issues

**Issue: "Required fields not mapped"**
- **Solution**: Ensure Company Name and Country/Headquarters are both mapped to columns

**Issue: "File failed to parse"**
- **Solution**: 
  - Check file format (CSV or Excel only)
  - Ensure file is not corrupted
  - Try re-exporting from your spreadsheet application
  - Remove special characters from column headers

**Issue: "Duplicate companies"**
- **Solution**: The app will import duplicates; manually review and remove if needed

**Issue: "Wrong category after import"**
- **Solution**: Delete imported entries and re-import with correct Commodity Type and Business Type selected

### After Importing

1. **Verify Import**: Search for newly imported companies in Market Directory
2. **Filter View**: Use commodity and business type filters to view your imports
3. **Edit Details**: Tap any company to view/edit additional information
4. **Add Verification**: Mark verified companies and add verification dates
5. **Add Ratings**: Rate imported companies based on your experience

### Industry Categorization Examples

**Scenario 1: Importing Gold Buyers**
- File: 50 companies that purchase gold
- Commodity Type: **Gold**
- Business Type: **Buyer**
- Result: Companies appear in "Gold Buyers" section

**Scenario 2: Importing Edible Oils Producers**
- File: 69 edible oils producers/sellers
- Commodity Type: **Edible Oils**
- Business Type: **Seller** (or **Both** if they also buy)
- Result: Companies appear in "Edible Oils Sellers" section

**Scenario 3: Importing Multi-Commodity Traders**
- File: Trading houses dealing in multiple commodities
- Approach: Import multiple times, once per commodity
- Example:
  - Import 1: Commodity = Gold, Business Type = Both
  - Import 2: Commodity = Fuel Oil, Business Type = Both
  - Same companies appear in multiple commodity sections

### Managing Imported Data

**Editing Imported Companies:**
- Tap any imported company in the Market Directory
- Add additional details not included in the import
- Update contact information
- Add verification status

**Removing Imported Companies:**
- Currently, imported companies persist in the app
- Use filters to hide companies you don't need
- Future updates will include delete functionality

**Re-Importing:**
- You can import the same companies multiple times
- Useful if you need to add them to multiple commodity categories
- Be aware this creates duplicates in different categories

---

## Understanding Risk Levels

### Risk Level Badges

#### GREEN - Low Risk
- Score: 80-100
- **Meaning**: Counterparty is well-established, financially sound, and compliant
- **Action**: Approved for trading, minimal oversight needed
- **Typical Characteristics**:
  - Major international trading houses
  - Strong financial statements
  - Clean sanctions screening
  - Proven delivery track record

#### AMBER - Medium Risk
- Score: 50-79
- **Meaning**: Some risk factors present, additional scrutiny required
- **Action**: Conditional approval, enhanced monitoring
- **Typical Characteristics**:
  - Newer companies with limited track record
  - Some financial concerns
  - Operating in higher-risk jurisdictions
  - Requires additional guarantees (LC, insurance, etc.)
- **Approval Conditions**:
  - Letter of Credit required
  - Higher collateral
  - Limited credit terms
  - More frequent reviews

#### RED - High Risk
- Score: 0-49
- **Meaning**: Significant risk factors, trading not recommended
- **Action**: Typically rejected, requires exceptional approval
- **Typical Characteristics**:
  - Sanctions concerns
  - Poor financial condition
  - History of defaults or disputes
  - Insufficient documentation
  - Operating in sanctioned jurisdictions

### Alert Types

#### WARNING (Yellow)
- Non-critical issues requiring attention
- Examples: Document expiring soon, minor compliance updates

#### CRITICAL (Red)
- Urgent issues requiring immediate action
- Examples: Sanctions hit, expired Letter of Credit, delivery delay

#### INFO (Blue)
- Informational updates
- Examples: Document uploaded, status change, delivery confirmation

---

## Trade Workflow

### Standard Trade Lifecycle

#### 1. Draft
- Trade Originator creates trade
- Fills in all required information
- Selects approved counterparty
- Reviews and submits

#### 2. Counterparty Review
- Internal review of counterparty suitability
- Verify counterparty is still approved
- Check for any new risk factors

#### 3. Risk Approval
- Risk Manager reviews trade
- Assesses exposure and limits
- Reviews counterparty risk score
- Approves or requests modifications

#### 4. Legal Review
- Legal team reviews contract terms
- Ensures compliance with regulations
- Reviews or drafts SPA
- Approves legal aspects

#### 5. Compliance Check
- Compliance Officer performs final checks
- Sanctions screening
- AML verification
- Regulatory compliance confirmation

#### 6. Financing Pending
- Arrange Letter of Credit
- Secure financing
- Payment terms confirmation
- Insurance arrangements

#### 7. Active
- Trade is live
- Awaiting shipment
- Documentation in progress

#### 8. In Transit
- Goods have been shipped
- Bill of Lading issued
- Tracking delivery progress
- ETA monitoring

#### 9. Delivered
- Goods received by counterparty
- Quality inspection complete
- Delivery confirmation received

#### 10. Settled
- Payment completed
- All documents exchanged
- Trade closed successfully

### Rejection Process
At any approval stage, authorized users can reject a trade:
- Trade status changes to "Rejected"
- Originator is notified with reason
- Trade can be modified and resubmitted

---

## Document Types

### Pre-Trade Documents

#### Letter of Intent (LOI)
- Buyer's preliminary interest in purchasing
- Non-binding expression of intent
- Includes approximate quantities and terms
- Starts negotiation process

#### Soft Corporate Offer (SCO)
- Seller's preliminary offer
- Outlines basic terms of sale
- Subject to final negotiation
- Not legally binding

#### Irrevocable Corporate Purchase Order (ICPO)
- Buyer's binding commitment to purchase
- Specific quantities, prices, and terms
- Legally binding once accepted
- Typically requires Proof of Funds

#### Proof of Funds (POF)
- Bank document verifying buyer has funds
- Required for large transactions
- Shows financial capability
- Typically from bank or financial institution

### Contract Documents

#### Master Service Agreement (MSA)
- Framework agreement for ongoing relationship
- Sets general terms and conditions
- Covers multiple transactions
- Long-term commercial relationship

#### Sales Purchase Agreement (SPA)
- Specific contract for individual trade
- Detailed terms, quantities, quality specs
- Delivery schedule and location
- Payment terms and conditions
- Legally binding contract

### Financial Documents

#### Letter of Credit (LC)
- Bank guarantee of payment
- Issued by buyer's bank
- Payment upon presentation of documents
- Reduces payment risk for seller
- Types: Irrevocable, Confirmed, Transferable

#### Bank Reference
- Letter from bank confirming relationship
- Verifies account existence
- May include credit limits
- Used in due diligence

### Shipping Documents

#### Bill of Lading (BOL)
- Issued by shipping carrier
- Receipt for goods
- Title document
- Required for customs clearance
- Types: Ocean BOL, Master BOL, House BOL

#### Certificate of Origin
- Certifies country where goods were produced
- Required for customs
- May affect tariffs and duties
- Issued by chamber of commerce or authority

#### Quality Certificate
- Verifies product specifications
- Issued by inspection company
- Tests for purity, grade, composition
- Required for commodity trades
- SGS, Bureau Veritas, Intertek are common issuers

### Due Diligence Documents

#### Financial Statements
- Balance sheet, income statement, cash flow
- Audited preferred
- Shows financial health
- Typically past 2-3 years

#### Business Licenses
- Legal authorization to conduct business
- Import/export licenses
- Commodity-specific permits
- Must be current and valid

#### Corporate Documents
- Articles of incorporation
- Certificate of good standing
- Shareholder registry
- Board resolutions for trading authority

---

## Incoterms Reference

### Common Incoterms Used

#### FOB (Free On Board)
- Seller delivers goods on board vessel
- Buyer pays freight and insurance
- Risk transfers when goods on board
- Common for bulk commodities

#### CIF (Cost, Insurance, and Freight)
- Seller pays freight and insurance to destination
- Risk transfers when goods on board
- Buyer receives goods at destination port
- Popular for international sea freight

#### CFR (Cost and Freight)
- Similar to CIF but without insurance
- Seller pays freight, buyer arranges insurance
- Risk transfers when goods on board

#### DAP (Delivered At Place)
- Seller delivers to named place
- Seller bears all risks until delivery
- Buyer handles import clearance

#### DDP (Delivered Duty Paid)
- Seller delivers goods cleared for import
- Seller pays all costs including duties
- Maximum obligation for seller

---

## Best Practices

### For Trade Originators
1. Always verify counterparty approval status before creating trade
2. Ensure all required documents are uploaded
3. Double-check quantities and pricing
4. Set realistic delivery windows
5. Maintain clear communication logs

### For Risk Managers
1. Review counterparty risk scores regularly
2. Monitor portfolio concentration
3. Set appropriate exposure limits
4. Escalate amber and red risks promptly
5. Keep risk assessments updated

### For Compliance Officers
1. Perform sanctions screening before approval
2. Document all compliance checks
3. Stay updated on regulatory changes
4. Maintain audit trail
5. Report suspicious activities

### For Legal Reviewers
1. Ensure all contracts are properly executed
2. Review jurisdiction and dispute resolution clauses
3. Verify signatory authority
4. Keep contract templates updated
5. Document legal opinions

### For Operations Managers
1. Track delivery deadlines closely
2. Coordinate with logistics providers
3. Ensure timely document exchange
4. Monitor shipment progress
5. Address delivery issues promptly

---

## Troubleshooting

### Cannot Create Trade
**Issue**: + button not working or form not submitting
**Solution**: 
- Ensure you have Trade Originator or Admin role
- Verify all required fields are filled
- Check that selected counterparty is approved
- Check internet connection

### Documents Not Uploading
**Issue**: Upload fails or hangs
**Solution**:
- Check file size (max 50MB)
- Verify file format (PDF, DOC, DOCX, JPG, PNG)
- Check internet connection
- Ensure camera/storage permissions granted
- Try different upload method (scan vs. file picker)

### Cannot Send Document Email
**Issue**: Send document fails
**Solution**:
- Verify recipient email address is valid
- Check SendGrid API configuration
- Ensure trade has all required information
- Check internet connection

### Risk Score Not Updating
**Issue**: Counterparty risk score appears outdated
**Solution**:
- Risk scores update periodically
- Contact admin to trigger manual refresh
- Verify all required documents are uploaded
- Check if sanctions screening is pending

### Trade Stuck in Status
**Issue**: Trade not moving to next stage
**Solution**:
- Check who needs to approve at current stage
- Verify all required documents for stage are uploaded
- Review any alerts or blocking issues
- Contact appropriate approver

---

## Data Security

### Document Storage
- All documents stored securely in Supabase cloud storage
- Encrypted at rest and in transit
- Access controlled by user roles
- Audit logs maintained

### Sensitive Information
- Financial data encrypted
- PII (Personally Identifiable Information) protected
- Bank details securely stored
- Compliance with data protection regulations

### User Access
- Role-based access control
- Audit trail of all actions
- Secure authentication
- Session management

---

## Support & Contact

For technical support or questions about the Fox Trade Master™ app:
- Email: support@foxtrademaster.com
- Phone: +1-804-506-9939
- Hours: 24/7 for critical issues

For regulatory or compliance questions:
- Contact your Compliance Officer
- Refer to internal compliance manual
- Consult legal team for contract issues

---

## Version Information

**App Version**: 1.0.0
**Last Updated**: December 2025
**Platform**: iOS, Android, Web
**Powered by**: Expo SDK 54

---

## Glossary

**Counterparty** - The other party in a trade (buyer or seller)

**Due Diligence** - Investigation and verification of a counterparty

**Incoterm** - International Commercial Term defining delivery responsibilities

**Letter of Credit (LC)** - Bank payment guarantee

**Bill of Lading (BOL)** - Shipping receipt and title document

**Sanctions Screening** - Checking counterparty against restricted party lists

**KYC** - Know Your Customer compliance procedures

**AML** - Anti-Money Laundering regulations

**FCM** - Futures Commission Merchant (type of broker)

**LBMA** - London Bullion Market Association

**OFAC** - Office of Foreign Assets Control (US sanctions authority)

**MT** - Metric Ton (unit of measurement)

**BBL** - Barrel (unit for oil measurement)

**Troy oz** - Troy ounce (unit for precious metals)

---

## Appendix: Commodity Specifications

### Gold
- Unit: Troy ounces (oz)
- Standard purity: 99.99% (Four Nines)
- Common forms: Bars, coins
- Market: LBMA, COMEX
- Typical incoterm: FOB, CIF

### Fuel Oil
- Unit: Barrels (BBL) or MT
- Grades: Bunker fuel, marine diesel
- Specifications: Viscosity, sulfur content
- Common origins: Middle East, Russia
- Typical incoterm: FOB, CIF

### Steam Coal
- Unit: Metric Tons (MT)
- Specifications: Calorific value (kcal/kg), ash content, moisture
- Common origins: Indonesia, Australia, South Africa
- Uses: Power generation
- Typical incoterm: FOB, CFR

### Anthracite Coal
- Unit: Metric Tons (MT)
- Higher grade than steam coal
- Higher carbon content, lower impurities
- Uses: Metallurgy, heating
- Common origins: China, Russia, Ukraine
- Typical incoterm: FOB, CIF

### Urea
- Unit: Metric Tons (MT)
- Specifications: Purity, prilling, moisture content
- Uses: Fertilizer, industrial
- Common origins: Middle East, China
- Typical incoterm: FOB, CFR, DAP

---

**End of User Manual**

*Fox Trade Master™ - Professional Commodity Trading Platform*
*Streamlining global commodity trade with confidence and compliance*