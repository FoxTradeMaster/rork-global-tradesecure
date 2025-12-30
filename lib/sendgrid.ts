export interface EmailAttachment {
  content: string;
  filename: string;
  type: string;
  disposition: 'attachment';
}

export interface SendDocumentParams {
  to: string;
  subject: string;
  documentType: 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'SPA' | 'MSA';
  tradeDetails: {
    commodity: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    incoterm: string;
    counterpartyName: string;
  };
  attachments?: EmailAttachment[];
}

export async function sendTradeDocument(params: SendDocumentParams): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: params.to }],
            subject: params.subject,
          },
        ],
        from: {
          email: 'trading@commodityplatform.com',
          name: 'Commodity Trading Platform',
        },
        content: [
          {
            type: 'text/html',
            value: generateEmailContent(params),
          },
        ],
        attachments: params.attachments,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return { success: false, error: `Failed to send email: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function generateEmailContent(params: SendDocumentParams): string {
  const { documentType, tradeDetails } = params;
  
  const documentDescriptions = {
    CIS: 'Corporate Information Sheet',
    SCO: 'Soft Corporate Offer',
    ICPO: 'Irrevocable Corporate Purchase Order',
    LOI: 'Letter of Intent',
    POF: 'Proof of Funds',
    NCNDA: 'Non-Circumvention and Non-Disclosure Agreement',
    SPA: 'Sales and Purchase Agreement',
    MSA: 'Master Sales Agreement',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0A0E27 0%, #1F2937 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .trade-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #111827; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Trade Document: ${documentDescriptions[documentType]}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Commodity Trading Platform</p>
        </div>
        <div class="content">
          <p>Dear ${tradeDetails.counterpartyName},</p>
          <p>Please find attached the ${documentDescriptions[documentType]} for your review.</p>
          
          <div class="trade-details">
            <h3 style="margin-top: 0;">Trade Summary</h3>
            <div class="detail-row">
              <span class="label">Commodity:</span>
              <span class="value">${tradeDetails.commodity.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quantity:</span>
              <span class="value">${tradeDetails.quantity.toLocaleString()} ${tradeDetails.unit}</span>
            </div>
            <div class="detail-row">
              <span class="label">Price per Unit:</span>
              <span class="value">$${tradeDetails.pricePerUnit.toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Value:</span>
              <span class="value">$${(tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString()}</span>
            </div>
            <div class="detail-row" style="border-bottom: none;">
              <span class="label">INCOTERM:</span>
              <span class="value">${tradeDetails.incoterm}</span>
            </div>
          </div>
          
          <p>Please review the attached document and confirm your acceptance at your earliest convenience.</p>
          
          <p>Should you have any questions or require clarification, please do not hesitate to contact us.</p>
          
          <p>Best regards,<br>Commodity Trading Platform</p>
          
          <div class="footer">
            <p>This is an automated message from Commodity Trading Platform</p>
            <p>© 2025 Commodity Trading Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateDocumentContent(
  documentType: 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA',
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  additionalInfo?: Record<string, any>
): string {
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  switch (documentType) {
    case 'CIS':
      return generateCIS(tradeDetails, date, additionalInfo);
    case 'SCO':
      return generateSCO(tradeDetails, date, additionalInfo);
    case 'ICPO':
      return generateICPO(tradeDetails, date, additionalInfo);
    case 'LOI':
      return generateLOI(tradeDetails, date, additionalInfo);
    case 'POF':
      return generatePOF(tradeDetails, date, additionalInfo);
    case 'NCNDA':
      return generateNCNDA(tradeDetails, date, additionalInfo);
    default:
      return '';
  }
}

function generateCIS(
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  date: string,
  additionalInfo?: Record<string, any>
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2cm; }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .document {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #1a1a1a;
    }
    .doc-title {
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .doc-subtitle {
      font-size: 10pt;
      color: #555;
      font-style: italic;
    }
    .date-ref {
      margin: 20px 0;
      padding: 10px 15px;
      background: #f5f5f5;
      border-left: 4px solid #333;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field {
      margin-bottom: 10px;
      padding-left: 15px;
    }
    .field-label {
      font-weight: 600;
      color: #333;
      display: inline-block;
      min-width: 180px;
    }
    .field-value {
      color: #000;
    }
    .signature-section {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
    }
    .signature-line {
      margin-top: 40px;
      padding-top: 10px;
      border-top: 2px solid #000;
      max-width: 400px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="doc-title">Corporate Information Sheet</div>
      <div class="doc-subtitle">Confidential Business Document</div>
    </div>

    <div class="date-ref">
      <strong>Document Date:</strong> ${date}<br>
      <strong>Reference:</strong> CIS-${Date.now()}
    </div>

    <div class="section">
      <div class="section-title">1. Corporate Details</div>
      <div class="field">
        <span class="field-label">Company Name:</span>
        <span class="field-value">${tradeDetails?.counterpartyName || '[Company Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Registration Number:</span>
        <span class="field-value">${additionalInfo?.registrationNumber || '[Registration Number]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Date of Incorporation:</span>
        <span class="field-value">${additionalInfo?.incorporationDate || '[Date]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Country of Registration:</span>
        <span class="field-value">${additionalInfo?.country || '[Country]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">2. Registered Address</div>
      <div class="field">
        <span class="field-value">${additionalInfo?.address || '[Registered Address]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">3. Contact Information</div>
      <div class="field">
        <span class="field-label">Phone:</span>
        <span class="field-value">${additionalInfo?.phone || '[Phone]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Email:</span>
        <span class="field-value">${additionalInfo?.email || '[Email]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Website:</span>
        <span class="field-value">${additionalInfo?.website || '[Website]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">4. Authorized Representatives</div>
      <div class="field">
        <span class="field-label">Name:</span>
        <span class="field-value">${additionalInfo?.representative || '[Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Title:</span>
        <span class="field-value">${additionalInfo?.title || '[Title]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Contact:</span>
        <span class="field-value">${additionalInfo?.representativeContact || '[Contact]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">5. Banking Information</div>
      <div class="field">
        <span class="field-label">Bank Name:</span>
        <span class="field-value">${additionalInfo?.bankName || '[Bank Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Bank Address:</span>
        <span class="field-value">${additionalInfo?.bankAddress || '[Bank Address]'}</span>
      </div>
      <div class="field">
        <span class="field-label">SWIFT Code:</span>
        <span class="field-value">${additionalInfo?.swiftCode || '[SWIFT Code]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Account Number:</span>
        <span class="field-value">${additionalInfo?.accountNumber || '[Account Number]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">6. Trade Licenses & Certifications</div>
      <div class="field">
        <span class="field-value">${additionalInfo?.licenses || '[License Information]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">7. Commodity Trading Experience</div>
      <div class="field">
        <span class="field-label">Years in Business:</span>
        <span class="field-value">${additionalInfo?.yearsInBusiness || '[Years]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Primary Commodities:</span>
        <span class="field-value">${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodities]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Annual Trading Volume:</span>
        <span class="field-value">${additionalInfo?.annualVolume || '[Volume]'}</span>
      </div>
    </div>

    <div class="signature-section">
      <p style="margin-bottom: 10px;"><em>This Corporate Information Sheet is provided for due diligence purposes and represents accurate information as of ${date}.</em></p>
      
      <div class="signature-line">
        <strong>Authorized Signature</strong>
      </div>
      
      <div class="field" style="margin-top: 20px;">
        <span class="field-label">Name:</span>
        <span class="field-value">${additionalInfo?.signatoryName || '[Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Title:</span>
        <span class="field-value">${additionalInfo?.signatoryTitle || '[Title]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Date:</span>
        <span class="field-value">${date}</span>
      </div>
    </div>

    <div class="footer">
      <p>This document is confidential and intended solely for the use of the recipient.<br>
      Unauthorized distribution or disclosure is strictly prohibited.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateSCO(
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  date: string,
  additionalInfo?: Record<string, any>
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2cm; }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .document { max-width: 800px; margin: 0 auto; background: white; }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #1a1a1a;
    }
    .doc-title {
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .doc-subtitle { font-size: 10pt; color: #555; font-style: italic; }
    .date-ref {
      margin: 20px 0;
      padding: 10px 15px;
      background: #f5f5f5;
      border-left: 4px solid #333;
    }
    .parties {
      margin: 20px 0;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 5px;
    }
    .section { margin-bottom: 25px; }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field { margin-bottom: 10px; padding-left: 15px; }
    .field-label {
      font-weight: 600;
      color: #333;
      display: inline-block;
      min-width: 200px;
    }
    .field-value { color: #000; }
    ul { margin: 10px 0; padding-left: 30px; }
    ul li { margin-bottom: 5px; }
    .signature-section {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
    }
    .signature-line {
      margin-top: 40px;
      padding-top: 10px;
      border-top: 2px solid #000;
      max-width: 400px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="doc-title">Soft Corporate Offer</div>
      <div class="doc-subtitle">Non-Binding Commercial Offer</div>
    </div>

    <div class="date-ref">
      <strong>Reference:</strong> SCO-${Date.now()}<br>
      <strong>Date:</strong> ${date}
    </div>

    <div class="parties">
      <strong>FROM:</strong> ${additionalInfo?.sellerName || '[Seller Name]'}<br>
      <strong>TO:</strong> ${tradeDetails?.counterpartyName || '[Buyer Name]'}
    </div>

    <p><strong>Dear Sir/Madam,</strong></p>
    
    <p>We, the undersigned, hereby confirm with full corporate responsibility that we are ready, willing, and able to supply the following commodity under the terms and conditions stated below:</p>

    <div class="section">
      <div class="section-title">1. Commodity Details</div>
      <div class="field">
        <span class="field-label">Product:</span>
        <span class="field-value">${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodity]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quantity:</span>
        <span class="field-value">${tradeDetails?.quantity.toLocaleString() || '[Quantity]'} ${tradeDetails?.unit || '[Unit]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quality:</span>
        <span class="field-value">${additionalInfo?.quality || '[As per international standards]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Origin:</span>
        <span class="field-value">${additionalInfo?.origin || '[Country of Origin]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">2. Pricing</div>
      <div class="field">
        <span class="field-label">Unit Price:</span>
        <span class="field-value">${tradeDetails?.pricePerUnit.toLocaleString() || '[Price]'} per ${tradeDetails?.unit || '[Unit]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Total Contract Value:</span>
        <span class="field-value">${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Total Value]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Price Basis:</span>
        <span class="field-value">${additionalInfo?.priceBasis || '[Fixed/Market-linked]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">3. Delivery Terms</div>
      <div class="field">
        <span class="field-label">INCOTERM:</span>
        <span class="field-value">${tradeDetails?.incoterm || '[INCOTERM]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Delivery Schedule:</span>
        <span class="field-value">${additionalInfo?.deliverySchedule || '[Delivery Period]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Loading Port:</span>
        <span class="field-value">${additionalInfo?.loadingPort || '[Port Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Discharge Port:</span>
        <span class="field-value">${additionalInfo?.dischargePort || '[Port Name]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">4. Payment Terms</div>
      <div class="field">
        <span class="field-label">Payment Method:</span>
        <span class="field-value">${additionalInfo?.paymentMethod || 'Irrevocable Letter of Credit (LC)'}</span>
      </div>
      <div class="field">
        <span class="field-label">Payment Terms:</span>
        <span class="field-value">${additionalInfo?.paymentTerms || 'At sight'}</span>
      </div>
      <div class="field">
        <span class="field-label">Banking:</span>
        <span class="field-value">${additionalInfo?.bankName || '[Bank Name]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">5. Inspection</div>
      <div class="field">
        <span class="field-label">Pre-shipment Inspection:</span>
        <span class="field-value">${additionalInfo?.inspector || 'SGS, Intertek, or Bureau Veritas'}</span>
      </div>
      <div class="field">
        <span class="field-value">Certificate of Quality and Quantity required</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">6. Documentation</div>
      <ul>
        <li>Commercial Invoice</li>
        <li>Bill of Lading</li>
        <li>Certificate of Origin</li>
        <li>Certificate of Quality</li>
        <li>Certificate of Quantity</li>
        <li>Packing List</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">7. Validity</div>
      <p style="padding-left: 15px;">This Soft Corporate Offer is valid for <strong>${additionalInfo?.validity || '7 days'}</strong> from the date of issue.</p>
    </div>

    <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;"><em><strong>Important:</strong> This offer is non-binding and subject to final contract negotiation and execution.</em></p>

    <div class="signature-section">
      <p><strong>Yours faithfully,</strong></p>
      
      <div class="signature-line">
        <strong>Authorized Signature</strong>
      </div>
      
      <div style="margin-top: 20px;">
        <div class="field">
          <span class="field-label">Name:</span>
          <span class="field-value">${additionalInfo?.signatoryName || '[Name]'}</span>
        </div>
        <div class="field">
          <span class="field-label">Title:</span>
          <span class="field-value">${additionalInfo?.signatoryTitle || '[Title]'}</span>
        </div>
        <div class="field">
          <span class="field-label">Company:</span>
          <span class="field-value">${additionalInfo?.sellerName || '[Company Name]'}</span>
        </div>
        <div class="field">
          <span class="field-label">Date:</span>
          <span class="field-value">${date}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>This document is confidential and intended solely for the use of the recipient.<br>
      Unauthorized distribution or disclosure is strictly prohibited.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateICPO(
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  date: string,
  additionalInfo?: Record<string, any>
): string {
  return `
IRREVOCABLE CORPORATE PURCHASE ORDER (ICPO)
Reference: ICPO-${Date.now()}
Date: ${date}

FROM: ${tradeDetails?.counterpartyName || '[Buyer Name]'} (BUYER)
TO: ${additionalInfo?.sellerName || '[Seller Name]'} (SELLER)

Dear Sir/Madam,

We, the undersigned, as buyers, hereby issue this Irrevocable Corporate Purchase Order with full corporate and financial responsibility to purchase the following commodity:

1. COMMODITY SPECIFICATION
Product: ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodity]'}
Quantity: ${tradeDetails?.quantity.toLocaleString() || '[Quantity]'} ${tradeDetails?.unit || '[Unit]'}
Quality Specification: ${additionalInfo?.quality || '[As per international standards]'}
Country of Origin: ${additionalInfo?.origin || '[Country of Origin]'}

2. PRICE AND PAYMENT
Unit Price: $${tradeDetails?.pricePerUnit.toLocaleString() || '[Price]'} per ${tradeDetails?.unit || '[Unit]'}
Total Value: $${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Total Value]'}
Currency: USD
Payment Method: Irrevocable, Confirmed, Transferable Letter of Credit
Payment Terms: ${additionalInfo?.paymentTerms || 'At sight'}

3. DELIVERY TERMS
INCOTERM 2020: ${tradeDetails?.incoterm || '[INCOTERM]'}
Shipment Period: ${additionalInfo?.shipmentPeriod || '[Shipment Period]'}
Partial Shipments: ${additionalInfo?.partialShipments || 'Not Allowed'}
Transshipment: ${additionalInfo?.transshipment || 'Not Allowed'}
Destination Port: ${additionalInfo?.destinationPort || '[Port Name]'}

4. INSPECTION AND CERTIFICATION
Pre-shipment Inspection: Mandatory by ${additionalInfo?.inspector || 'SGS/Intertek/Bureau Veritas'}
Quality Certificate: As per international standards
Quantity Certificate: As per Bill of Lading
All inspection costs borne by: ${additionalInfo?.inspectionCostBearer || 'Seller'}

5. REQUIRED DOCUMENTS
1. Commercial Invoice (Original + 3 copies)
2. Full Set Clean on Board Bill of Lading
3. Certificate of Origin
4. Certificate of Quality
5. Certificate of Quantity
6. Packing List
7. Insurance Certificate (if applicable)

6. BANKING DETAILS
Buyer's Bank: ${additionalInfo?.buyerBank || '[Bank Name]'}
Bank Address: ${additionalInfo?.buyerBankAddress || '[Bank Address]'}
SWIFT Code: ${additionalInfo?.buyerSwift || '[SWIFT Code]'}

7. TERMS AND CONDITIONS
- This ICPO is irrevocable and binding upon issuance
- Seller must provide a signed Sales and Purchase Agreement within 5 banking days
- Letter of Credit will be established within 10 banking days of contract signing
- Any deviation from specifications may result in rejection of goods
- Penalties apply for late delivery as per contract terms

8. VALIDITY
This ICPO is valid from ${date} and remains valid for ${additionalInfo?.validity || '30 days'}.

We confirm that we have the financial capability and full authority to fulfill this purchase order.

FOR AND ON BEHALF OF BUYER:

_________________________
Signature

Name: ${additionalInfo?.buyerSignatoryName || '[Name]'}
Title: ${additionalInfo?.buyerSignatoryTitle || '[Title]'}
Company: ${tradeDetails?.counterpartyName || '[Buyer Company]'}
Company Seal: [SEAL]
Date: ${date}

BUYER COMPANY DETAILS:
Registration Number: ${additionalInfo?.buyerRegistration || '[Registration Number]'}
Address: ${additionalInfo?.buyerAddress || '[Company Address]'}
Phone: ${additionalInfo?.buyerPhone || '[Phone Number]'}
Email: ${additionalInfo?.buyerEmail || '[Email Address]'}
  `.trim();
}

function generateLOI(
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  date: string,
  additionalInfo?: Record<string, any>
): string {
  return `
LETTER OF INTENT (LOI)
Reference: LOI-${Date.now()}
Date: ${date}

FROM: ${tradeDetails?.counterpartyName || '[Buyer Name]'} ("Buyer")
TO: ${additionalInfo?.sellerName || '[Seller Name]'} ("Seller")

Dear Sir/Madam,

RE: LETTER OF INTENT TO PURCHASE ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[COMMODITY]'}

This Letter of Intent ("LOI") sets forth the understanding between the parties regarding the proposed transaction for the purchase and sale of the commodity specified below.

1. PARTIES
Buyer: ${tradeDetails?.counterpartyName || '[Buyer Name]'}
Seller: ${additionalInfo?.sellerName || '[Seller Name]'}

2. COMMODITY DESCRIPTION
Product: ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodity]'}
Quantity: ${tradeDetails?.quantity.toLocaleString() || '[Quantity]'} ${tradeDetails?.unit || '[Unit]'}
Quality: ${additionalInfo?.quality || '[As per international standards]'}
Origin: ${additionalInfo?.origin || '[Country of Origin]'}

3. COMMERCIAL TERMS
Unit Price: ${tradeDetails?.pricePerUnit.toLocaleString() || '[Price]'} per ${tradeDetails?.unit || '[Unit]'}
Total Contract Value: ${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Total Value]'} USD
Price Basis: ${additionalInfo?.priceBasis || '[Fixed/Market-linked]'}
INCOTERM 2020: ${tradeDetails?.incoterm || '[INCOTERM]'}

4. DELIVERY TERMS
Shipment Period: ${additionalInfo?.shipmentPeriod || '[Shipment Period]'}
Loading Port: ${additionalInfo?.loadingPort || '[Port Name]'}
Destination Port: ${additionalInfo?.destinationPort || '[Port Name]'}
Partial Shipments: ${additionalInfo?.partialShipments || 'Not Allowed'}

5. PAYMENT TERMS
Payment Method: ${additionalInfo?.paymentMethod || 'Irrevocable Letter of Credit (LC)'}
Payment Terms: ${additionalInfo?.paymentTerms || 'At sight'}
Buyer's Bank: ${additionalInfo?.buyerBank || '[Bank Name]'}

6. INSPECTION AND QUALITY
Pre-shipment Inspection: ${additionalInfo?.inspector || 'SGS, Intertek, or Bureau Veritas'}
Certificates Required:
  - Certificate of Quality
  - Certificate of Quantity
  - Certificate of Origin
  - Full set of clean on board Bills of Lading

7. NEXT STEPS
Upon acceptance of this LOI, the parties agree to:
a) Execute a formal Sales and Purchase Agreement within ${additionalInfo?.contractDays || '10 banking days'}
b) Buyer to provide Proof of Funds (POF) within ${additionalInfo?.pofDays || '3 banking days'}
c) Seller to provide all required corporate documents and certificates
d) Buyer to establish Letter of Credit as per agreed terms

8. VALIDITY AND BINDING EFFECT
This LOI is valid for ${additionalInfo?.validity || '15 days'} from the date hereof and serves as a statement of mutual interest to proceed with the transaction. This LOI is non-binding until a formal Sales and Purchase Agreement is executed by both parties.

9. CONFIDENTIALITY
Both parties agree to treat all information exchanged in connection with this transaction as confidential and not to disclose such information to any third party without prior written consent.

10. GOVERNING LAW
This LOI shall be governed by and construed in accordance with the laws of ${additionalInfo?.governingLaw || '[Jurisdiction]'}.

We confirm our serious intent to proceed with this transaction subject to successful completion of due diligence and execution of definitive agreements.

Yours faithfully,

FOR AND ON BEHALF OF BUYER:

_________________________
Signature

Name: ${additionalInfo?.buyerSignatoryName || '[Name]'}
Title: ${additionalInfo?.buyerSignatoryTitle || '[Title]'}
Company: ${tradeDetails?.counterpartyName || '[Buyer Company]'}
Date: ${date}

BUYER COMPANY DETAILS:
Registration Number: ${additionalInfo?.buyerRegistration || '[Registration Number]'}
Address: ${additionalInfo?.buyerAddress || '[Company Address]'}
Phone: ${additionalInfo?.buyerPhone || '[Phone Number]'}
Email: ${additionalInfo?.buyerEmail || '[Email Address]'}
  `.trim();
}

function generatePOF(
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  date: string,
  additionalInfo?: Record<string, any>
): string {
  return `
PROOF OF FUNDS (POF)
Reference: POF-${Date.now()}
Date: ${date}

TO WHOM IT MAY CONCERN

RE: PROOF OF FUNDS FOR ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[COMMODITY]'} TRANSACTION

This Proof of Funds letter is issued by ${additionalInfo?.bankName || '[Bank Name]'} on behalf of our valued client:

CLIENT INFORMATION:
Company Name: ${tradeDetails?.counterpartyName || '[Company Name]'}
Account Number: ${additionalInfo?.accountNumber || '[Account Number - Masked for Security]'}
Registration Number: ${additionalInfo?.registrationNumber || '[Registration Number]'}
Address: ${additionalInfo?.companyAddress || '[Company Address]'}

BANK INFORMATION:
Bank Name: ${additionalInfo?.bankName || '[Bank Name]'}
Bank Address: ${additionalInfo?.bankAddress || '[Bank Address]'}
SWIFT Code: ${additionalInfo?.swiftCode || '[SWIFT Code]'}
Bank License Number: ${additionalInfo?.bankLicense || '[License Number]'}

TRANSACTION DETAILS:
Purpose: Purchase of ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodity]'}
Quantity: ${tradeDetails?.quantity.toLocaleString() || '[Quantity]'} ${tradeDetails?.unit || '[Unit]'}
Estimated Transaction Value: ${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Amount]'} USD
Counterparty: ${additionalInfo?.sellerName || '[Seller Name]'}

CERTIFICATION:

We, ${additionalInfo?.bankName || '[Bank Name]'}, hereby certify and confirm that:

1. The above-named client maintains an active account with our institution in good standing.

2. Our client has sufficient funds and/or approved credit facilities available to fulfill the financial obligations for the above-referenced transaction.

3. The funds are unencumbered, of non-criminal origin, and free from any liens or legal restrictions that would prevent their use for this transaction.

4. We confirm that funds totaling ${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Amount]'} USD are available and can be transferred upon receipt of proper documentation and fulfillment of contract terms.

5. This bank is ready, willing, and able to issue an Irrevocable Letter of Credit or effect payment via bank-to-bank transfer in accordance with the terms of the Sales and Purchase Agreement.

6. All funds comply with international Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations.

7. This bank is regulated by ${additionalInfo?.regulator || '[Banking Regulatory Authority]'} and operates in full compliance with all applicable banking laws and international standards.

IMPORTANT NOTES:
- This Proof of Funds is issued for the specific transaction referenced above
- This letter does not constitute a commitment to transfer funds
- Actual transfer of funds is subject to proper contract execution and documentation
- This POF is valid for ${additionalInfo?.validity || '30 days'} from the date of issue
- This letter is confidential and intended solely for the transaction parties

CONFIDENTIALITY:
This Proof of Funds letter is issued in strict confidence and may only be used for the purpose stated above. Any unauthorized disclosure or use of this document is strictly prohibited.

VALIDITY:
This Proof of Funds letter is valid from ${date} until ${additionalInfo?.expiryDate || '[Expiry Date]'}.

For verification of this document, please contact our Corporate Banking Department:
Phone: ${additionalInfo?.bankPhone || '[Bank Phone]'}
Email: ${additionalInfo?.bankEmail || '[Bank Email]'}
Reference: POF-${Date.now()}

Yours faithfully,

FOR AND ON BEHALF OF ${additionalInfo?.bankName || '[Bank Name]'}:

_________________________
Authorized Signature

Name: ${additionalInfo?.bankOfficerName || '[Bank Officer Name]'}
Title: ${additionalInfo?.bankOfficerTitle || '[Title - e.g., Senior Vice President, Corporate Banking]'}
Department: Corporate Banking

_________________________
Bank Official Stamp/Seal

DISCLAIMER:
This document is issued based on information provided by the client and the bank's internal records as of ${date}. The bank assumes no liability for the accuracy of transaction details provided by the client. This POF does not constitute a guarantee of payment and should not be construed as a financial commitment beyond certification of available funds.
  `.trim();
}

function generateNCNDA(
  tradeDetails: SendDocumentParams['tradeDetails'] | null,
  date: string,
  additionalInfo?: Record<string, any>
): string {
  return `
NON-CIRCUMVENTION AND NON-DISCLOSURE AGREEMENT (NCNDA)

Reference: NCNDA-${Date.now()}
Date: ${date}

This Non-Circumvention and Non-Disclosure Agreement ("Agreement") is entered into on ${date} by and between:

PARTY A ("Disclosing Party"):
Company Name: ${additionalInfo?.partyAName || '[Party A Company Name]'}
Registration Number: ${additionalInfo?.partyARegistration || '[Registration Number]'}
Address: ${additionalInfo?.partyAAddress || '[Company Address]'}
Represented by: ${additionalInfo?.partyARepresentative || '[Name and Title]'}

AND

PARTY B ("Receiving Party"):
Company Name: ${additionalInfo?.partyBName || tradeDetails?.counterpartyName || '[Party B Company Name]'}
Registration Number: ${additionalInfo?.partyBRegistration || '[Registration Number]'}
Address: ${additionalInfo?.partyBAddress || '[Company Address]'}
Represented by: ${additionalInfo?.partyBRepresentative || '[Name and Title]'}

Collectively referred to as the "Parties" and individually as a "Party."

WHEREAS:

A. The Parties wish to engage in discussions and business transactions related to ${tradeDetails?.commodity ? tradeDetails.commodity.replace(/_/g, ' ').toUpperCase() : '[Commodity/Business Activity]'}.

B. In connection with such discussions and transactions, each Party may disclose to the other Party certain confidential and proprietary information.

C. The Parties desire to protect the confidentiality of such information and establish terms to prevent circumvention in their business dealings.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

1. NON-DISCLOSURE

1.1 "Confidential Information" means any and all information disclosed by one Party to the other Party, whether orally, in writing, electronically, or by any other means, including but not limited to:
   a) Business plans, strategies, and methods
   b) Financial information, pricing, and terms
   c) Customer and supplier lists and contacts
   d) Technical data and specifications
   e) Trade secrets and proprietary information
   f) Market analyses and business opportunities
   g) Contract terms and negotiations
   h) Any information marked as "Confidential" or which would reasonably be considered confidential

1.2 Each Party agrees to:
   a) Keep all Confidential Information strictly confidential
   b) Not disclose Confidential Information to any third party without prior written consent
   c) Use Confidential Information solely for the purpose of evaluating and conducting the proposed business transaction
   d) Protect Confidential Information with the same degree of care used to protect its own confidential information, but in no event less than reasonable care
   e) Limit access to Confidential Information to employees, agents, or advisors who have a legitimate need to know and who are bound by confidentiality obligations

1.3 Confidential Information does not include information that:
   a) Was publicly known at the time of disclosure
   b) Becomes publicly known through no breach of this Agreement
   c) Was rightfully in the possession of the Receiving Party prior to disclosure
   d) Is independently developed by the Receiving Party without use of the Confidential Information
   e) Is rightfully received from a third party without breach of any confidentiality obligation

2. NON-CIRCUMVENTION

2.1 Each Party agrees not to circumvent, avoid, bypass, or obviate the other Party by:
   a) Directly or indirectly contacting, dealing with, or entering into any agreement with any party, contact, or source of supply introduced or disclosed by the other Party
   b) Using Confidential Information to contact or deal with any such parties for any business purpose
   c) Attempting to gain any financial benefit or advantage from such contacts without the full involvement and written consent of the introducing Party

2.2 The non-circumvention obligations shall apply to:
   a) All contacts, clients, suppliers, financiers, or other parties introduced by either Party
   b) All business opportunities arising from such introductions
   c) Any transactions, agreements, or arrangements resulting from such introductions

2.3 In the event of any transaction with an introduced party, the introducing Party shall be entitled to:
   a) Full participation in such transaction as agreed between the Parties
   b) Commission or fees as per separate agreement
   c) Full disclosure of all terms and conditions

3. TERM AND TERMINATION

3.1 This Agreement shall commence on the date first written above and shall continue for a period of ${additionalInfo?.termYears || '5 (five)'} years.

3.2 The obligations of confidentiality and non-circumvention shall survive the termination of this Agreement and continue for an additional ${additionalInfo?.postTermYears || '5 (five)'} years.

3.3 Either Party may terminate this Agreement upon ${additionalInfo?.noticePeriod || '30 days'} written notice to the other Party, provided that all obligations under this Agreement shall survive such termination as specified herein.

4. REMEDIES

4.1 The Parties acknowledge that breach of this Agreement would cause irreparable harm for which monetary damages would be an inadequate remedy.

4.2 In the event of breach or threatened breach, the non-breaching Party shall be entitled to:
   a) Immediate injunctive relief without the necessity of posting bond
   b) Recovery of all costs and expenses, including reasonable attorney's fees
   c) Any other remedies available at law or in equity

4.3 In the event of circumvention, the circumventing Party shall be liable to pay:
   a) All commissions, fees, or benefits that would have accrued to the circumvented Party
   b) Liquidated damages of ${additionalInfo?.liquidatedDamages || '[Amount]'}
   c) Any actual damages proven by the circumvented Party

5. RETURN OF INFORMATION

5.1 Upon termination of this Agreement or upon request by the Disclosing Party, the Receiving Party shall:
   a) Promptly return all Confidential Information in tangible form
   b) Permanently delete all electronic copies of Confidential Information
   c) Certify in writing that all such information has been returned or destroyed

6. NO LICENSE OR TRANSFER

6.1 Nothing in this Agreement grants any license, right, title, or interest in any Confidential Information, intellectual property, patents, trademarks, or copyrights.

6.2 All Confidential Information remains the sole property of the Disclosing Party.

7. NO OBLIGATION

7.1 This Agreement does not obligate either Party to:
   a) Disclose any particular information
   b) Enter into any business transaction or relationship
   c) Continue discussions beyond what either Party deems appropriate

8. REPRESENTATIONS AND WARRANTIES

8.1 Each Party represents and warrants that:
   a) It has full authority to enter into this Agreement
   b) This Agreement is legally binding upon it
   c) Execution of this Agreement does not violate any other agreement or obligation
   d) Its representatives are authorized to act on its behalf

9. GOVERNING LAW AND JURISDICTION

9.1 This Agreement shall be governed by and construed in accordance with the laws of ${additionalInfo?.governingLaw || '[Jurisdiction]'}, without regard to its conflict of law provisions.

9.2 Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of ${additionalInfo?.jurisdiction || '[Jurisdiction]'}.

9.3 The Parties agree to first attempt resolution of disputes through good faith negotiations before initiating legal proceedings.

10. GENERAL PROVISIONS

10.1 Entire Agreement: This Agreement constitutes the entire agreement between the Parties concerning its subject matter and supersedes all prior agreements and understandings.

10.2 Amendments: This Agreement may only be amended by written agreement signed by both Parties.

10.3 Waiver: No waiver of any provision shall be deemed or constitute a waiver of any other provision.

10.4 Severability: If any provision is found invalid or unenforceable, the remaining provisions shall continue in full force and effect.

10.5 Assignment: Neither Party may assign this Agreement without the prior written consent of the other Party.

10.6 Notices: All notices shall be in writing and delivered to the addresses set forth above or such other addresses as may be designated in writing.

10.7 Counterparts: This Agreement may be executed in counterparts, each of which shall be deemed an original.

IN WITNESS WHEREOF, the Parties have executed this Non-Circumvention and Non-Disclosure Agreement as of the date first written above.

PARTY A (Disclosing Party):

_________________________
Signature

Name: ${additionalInfo?.partyASignatoryName || '[Name]'}
Title: ${additionalInfo?.partyASignatoryTitle || '[Title]'}
Company: ${additionalInfo?.partyAName || '[Party A Company Name]'}
Date: ${date}

Company Seal: [SEAL]


PARTY B (Receiving Party):

_________________________
Signature

Name: ${additionalInfo?.partyBSignatoryName || '[Name]'}
Title: ${additionalInfo?.partyBSignatoryTitle || '[Title]'}
Company: ${additionalInfo?.partyBName || tradeDetails?.counterpartyName || '[Party B Company Name]'}
Date: ${date}

Company Seal: [SEAL]


WITNESS:

Witness 1:
_________________________
Name: ${additionalInfo?.witness1Name || '[Name]'}
Date: ${date}

Witness 2:
_________________________
Name: ${additionalInfo?.witness2Name || '[Name]'}
Date: ${date}
  `.trim();
}

export function generateBlankDocument(documentType: 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA'): string {
  return generateDocumentContent(documentType, null, {});
}

export interface BulkEmailParams {
  to: string;
  from: string;
  subject: string;
  body: string;
}

export async function sendBulkEmails(emails: BulkEmailParams[]): Promise<{ success: boolean; error?: string }> {
  try {
    const sendPromises = emails.map(email => 
      fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: email.to }],
              subject: email.subject,
            },
          ],
          from: {
            email: email.from,
            name: 'Commodity Trading Platform',
          },
          content: [
            {
              type: 'text/plain',
              value: email.body,
            },
          ],
        }),
      })
    );

    const results = await Promise.all(sendPromises);
    
    const failures = results.filter(r => !r.ok);
    if (failures.length > 0) {
      console.error('Some emails failed to send:', failures.length);
      return { success: false, error: `${failures.length} emails failed to send` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
