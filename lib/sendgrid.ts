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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2.5cm; }
    body {
      font-family: 'Times New Roman', 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #000;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .document { max-width: 800px; margin: 0 auto; background: white; }
    .header {
      text-align: center;
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 3px double #1a1a1a;
    }
    .doc-title {
      font-size: 20pt;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 10px;
      text-transform: uppercase;
      color: #000;
    }
    .doc-subtitle {
      font-size: 10pt;
      color: #444;
      font-style: italic;
      letter-spacing: 0.5px;
    }
    .date-ref {
      margin: 25px 0;
      padding: 15px 20px;
      background: #f8f8f8;
      border-left: 5px solid #2c3e50;
      font-size: 10.5pt;
    }
    .parties {
      margin: 25px 0;
      padding: 18px;
      background: #f0f4f8;
      border-radius: 3px;
      line-height: 1.8;
    }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #34495e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .field {
      margin-bottom: 12px;
      padding-left: 20px;
      line-height: 1.8;
    }
    .field-label {
      font-weight: 600;
      color: #2c3e50;
      display: inline-block;
      min-width: 220px;
    }
    .field-value { color: #000; }
    ul {
      margin: 15px 0;
      padding-left: 40px;
      line-height: 2;
    }
    ul li { margin-bottom: 8px; }
    .terms-box {
      margin: 20px 0;
      padding: 18px;
      background: #fff9e6;
      border-left: 5px solid #f39c12;
      line-height: 1.9;
    }
    .terms-box ul { padding-left: 25px; }
    .signature-section {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #34495e;
      page-break-inside: avoid;
    }
    .signature-block {
      margin-top: 50px;
      padding: 20px;
      background: #fafafa;
      border-radius: 3px;
    }
    .signature-line {
      margin-top: 45px;
      margin-bottom: 10px;
      padding-top: 12px;
      border-top: 2px solid #000;
      max-width: 450px;
      font-weight: bold;
      font-size: 10pt;
    }
    .company-details {
      margin-top: 30px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
    }
    .footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 1px solid #bbb;
      text-align: center;
      font-size: 9pt;
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="doc-title">Irrevocable Corporate Purchase Order</div>
      <div class="doc-subtitle">(ICPO)</div>
    </div>

    <div class="date-ref">
      <strong>Reference Number:</strong> ICPO-${Date.now()}<br>
      <strong>Date of Issue:</strong> ${date}
    </div>

    <div class="parties">
      <strong>FROM:</strong> ${tradeDetails?.counterpartyName || '[Buyer Name]'} ("BUYER")<br>
      <strong>TO:</strong> ${additionalInfo?.sellerName || '[Seller Name]'} ("SELLER")
    </div>

    <p style="margin: 25px 0; line-height: 1.8;"><strong>Dear Sir/Madam,</strong></p>
    
    <p style="text-align: justify; line-height: 1.8; margin-bottom: 25px;">We, the undersigned, as buyers, hereby issue this Irrevocable Corporate Purchase Order with full corporate and financial responsibility to purchase the following commodity under the terms and conditions specified herein:</p>

    <div class="section">
      <div class="section-title">1. Commodity Specification</div>
      <div class="field">
        <span class="field-label">Product:</span>
        <span class="field-value">${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodity]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quantity:</span>
        <span class="field-value">${tradeDetails?.quantity.toLocaleString() || '[Quantity]'} ${tradeDetails?.unit || '[Unit]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quality Specification:</span>
        <span class="field-value">${additionalInfo?.quality || '[As per international standards]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Country of Origin:</span>
        <span class="field-value">${additionalInfo?.origin || '[Country of Origin]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">2. Price and Payment</div>
      <div class="field">
        <span class="field-label">Unit Price:</span>
        <span class="field-value">${tradeDetails?.pricePerUnit.toLocaleString() || '[Price]'} per ${tradeDetails?.unit || '[Unit]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Total Contract Value:</span>
        <span class="field-value">${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Total Value]'} USD</span>
      </div>
      <div class="field">
        <span class="field-label">Currency:</span>
        <span class="field-value">United States Dollars (USD)</span>
      </div>
      <div class="field">
        <span class="field-label">Payment Method:</span>
        <span class="field-value">Irrevocable, Confirmed, Transferable Letter of Credit</span>
      </div>
      <div class="field">
        <span class="field-label">Payment Terms:</span>
        <span class="field-value">${additionalInfo?.paymentTerms || 'At sight'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">3. Delivery Terms</div>
      <div class="field">
        <span class="field-label">INCOTERM 2020:</span>
        <span class="field-value">${tradeDetails?.incoterm || '[INCOTERM]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Shipment Period:</span>
        <span class="field-value">${additionalInfo?.shipmentPeriod || '[Shipment Period]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Partial Shipments:</span>
        <span class="field-value">${additionalInfo?.partialShipments || 'Not Allowed'}</span>
      </div>
      <div class="field">
        <span class="field-label">Transshipment:</span>
        <span class="field-value">${additionalInfo?.transshipment || 'Not Allowed'}</span>
      </div>
      <div class="field">
        <span class="field-label">Destination Port:</span>
        <span class="field-value">${additionalInfo?.destinationPort || '[Port Name]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">4. Inspection and Certification</div>
      <div class="field">
        <span class="field-label">Pre-shipment Inspection:</span>
        <span class="field-value">Mandatory by ${additionalInfo?.inspector || 'SGS/Intertek/Bureau Veritas'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quality Certificate:</span>
        <span class="field-value">As per international standards</span>
      </div>
      <div class="field">
        <span class="field-label">Quantity Certificate:</span>
        <span class="field-value">As per Bill of Lading</span>
      </div>
      <div class="field">
        <span class="field-label">Inspection Costs Borne By:</span>
        <span class="field-value">${additionalInfo?.inspectionCostBearer || 'Seller'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">5. Required Documents</div>
      <ul>
        <li>Commercial Invoice (Original + 3 copies)</li>
        <li>Full Set Clean on Board Bill of Lading</li>
        <li>Certificate of Origin</li>
        <li>Certificate of Quality</li>
        <li>Certificate of Quantity</li>
        <li>Packing List</li>
        <li>Insurance Certificate (if applicable)</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">6. Banking Details</div>
      <div class="field">
        <span class="field-label">Buyer's Bank:</span>
        <span class="field-value">${additionalInfo?.buyerBank || '[Bank Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Bank Address:</span>
        <span class="field-value">${additionalInfo?.buyerBankAddress || '[Bank Address]'}</span>
      </div>
      <div class="field">
        <span class="field-label">SWIFT Code:</span>
        <span class="field-value">${additionalInfo?.buyerSwift || '[SWIFT Code]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">7. Terms and Conditions</div>
      <div class="terms-box">
        <ul>
          <li>This ICPO is irrevocable and binding upon issuance</li>
          <li>Seller must provide a signed Sales and Purchase Agreement within 5 banking days</li>
          <li>Letter of Credit will be established within 10 banking days of contract signing</li>
          <li>Any deviation from specifications may result in rejection of goods</li>
          <li>Penalties apply for late delivery as per contract terms</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">8. Validity</div>
      <p style="padding-left: 20px; line-height: 1.8;">This Irrevocable Corporate Purchase Order is valid from <strong>${date}</strong> and remains valid for <strong>${additionalInfo?.validity || '30 days'}</strong>.</p>
    </div>

    <p style="margin: 30px 0; padding: 20px; background: #e8f5e9; border-left: 5px solid #4caf50; line-height: 1.8; text-align: justify;"><strong>Declaration:</strong> We confirm that we have the financial capability and full authority to fulfill this purchase order and enter into a binding agreement for the transaction specified herein.</p>

    <div class="signature-section">
      <p style="margin-bottom: 20px; font-weight: 600; font-size: 11pt;">FOR AND ON BEHALF OF BUYER:</p>
      
      <div class="signature-block">
        <div class="signature-line">
          AUTHORIZED SIGNATURE
        </div>
        
        <div style="margin-top: 25px;">
          <div class="field">
            <span class="field-label">Name:</span>
            <span class="field-value">${additionalInfo?.buyerSignatoryName || '[Name]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Title:</span>
            <span class="field-value">${additionalInfo?.buyerSignatoryTitle || '[Title]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Company:</span>
            <span class="field-value">${tradeDetails?.counterpartyName || '[Buyer Company]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Date:</span>
            <span class="field-value">${date}</span>
          </div>
          <div class="field">
            <span class="field-label">Company Seal:</span>
            <span class="field-value">[SEAL]</span>
          </div>
        </div>
      </div>
    </div>

    <div class="company-details">
      <p style="font-weight: bold; margin-bottom: 15px; font-size: 11.5pt; color: #2c3e50;">BUYER COMPANY DETAILS:</p>
      <div class="field">
        <span class="field-label">Registration Number:</span>
        <span class="field-value">${additionalInfo?.buyerRegistration || '[Registration Number]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Registered Address:</span>
        <span class="field-value">${additionalInfo?.buyerAddress || '[Company Address]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Phone:</span>
        <span class="field-value">${additionalInfo?.buyerPhone || '[Phone Number]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Email:</span>
        <span class="field-value">${additionalInfo?.buyerEmail || '[Email Address]'}</span>
      </div>
    </div>

    <div class="footer">
      <p>This document is confidential and intended solely for the use of the named recipient.<br>
      Unauthorized distribution, copying, or disclosure is strictly prohibited.<br>
      © ${new Date().getFullYear()} Commodity Trading Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateLOI(
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
    @page { margin: 2.5cm; }
    body {
      font-family: 'Times New Roman', 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #000;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .document { max-width: 800px; margin: 0 auto; background: white; }
    .header {
      text-align: center;
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 3px double #1a1a1a;
    }
    .doc-title {
      font-size: 20pt;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .doc-subtitle { font-size: 10pt; color: #444; font-style: italic; }
    .date-ref {
      margin: 25px 0;
      padding: 15px 20px;
      background: #f8f8f8;
      border-left: 5px solid #2c3e50;
      font-size: 10.5pt;
    }
    .parties {
      margin: 25px 0;
      padding: 18px;
      background: #f0f4f8;
      border-radius: 3px;
      line-height: 1.8;
    }
    .re-line {
      margin: 30px 0;
      padding: 15px;
      background: #e3f2fd;
      border-left: 5px solid #1976d2;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #34495e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .field {
      margin-bottom: 12px;
      padding-left: 20px;
      line-height: 1.8;
    }
    .field-label {
      font-weight: 600;
      color: #2c3e50;
      display: inline-block;
      min-width: 220px;
    }
    .field-value { color: #000; }
    ul {
      margin: 15px 0;
      padding-left: 40px;
      line-height: 2;
    }
    ul li { margin-bottom: 8px; }
    .indent { padding-left: 40px; line-height: 1.9; }
    .signature-section {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #34495e;
      page-break-inside: avoid;
    }
    .signature-block {
      margin-top: 50px;
      padding: 20px;
      background: #fafafa;
      border-radius: 3px;
    }
    .signature-line {
      margin-top: 45px;
      margin-bottom: 10px;
      padding-top: 12px;
      border-top: 2px solid #000;
      max-width: 450px;
      font-weight: bold;
      font-size: 10pt;
    }
    .company-details {
      margin-top: 30px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
    }
    .footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 1px solid #bbb;
      text-align: center;
      font-size: 9pt;
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="doc-title">Letter of Intent</div>
      <div class="doc-subtitle">(LOI)</div>
    </div>

    <div class="date-ref">
      <strong>Reference Number:</strong> LOI-${Date.now()}<br>
      <strong>Date of Issue:</strong> ${date}
    </div>

    <div class="parties">
      <strong>FROM:</strong> ${tradeDetails?.counterpartyName || '[Buyer Name]'} ("Buyer")<br>
      <strong>TO:</strong> ${additionalInfo?.sellerName || '[Seller Name]'} ("Seller")
    </div>

    <p style="margin: 25px 0; line-height: 1.8;"><strong>Dear Sir/Madam,</strong></p>

    <div class="re-line">
      RE: LETTER OF INTENT TO PURCHASE ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[COMMODITY]'}
    </div>
    
    <p style="text-align: justify; line-height: 1.8; margin-bottom: 25px;">This Letter of Intent ("LOI") sets forth the understanding between the parties regarding the proposed transaction for the purchase and sale of the commodity specified below.</p>

    <div class="section">
      <div class="section-title">1. Parties</div>
      <div class="field">
        <span class="field-label">Buyer:</span>
        <span class="field-value">${tradeDetails?.counterpartyName || '[Buyer Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Seller:</span>
        <span class="field-value">${additionalInfo?.sellerName || '[Seller Name]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">2. Commodity Description</div>
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
      <div class="section-title">3. Commercial Terms</div>
      <div class="field">
        <span class="field-label">Unit Price:</span>
        <span class="field-value">${tradeDetails?.pricePerUnit.toLocaleString() || '[Price]'} per ${tradeDetails?.unit || '[Unit]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Total Contract Value:</span>
        <span class="field-value">${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Total Value]'} USD</span>
      </div>
      <div class="field">
        <span class="field-label">Price Basis:</span>
        <span class="field-value">${additionalInfo?.priceBasis || '[Fixed/Market-linked]'}</span>
      </div>
      <div class="field">
        <span class="field-label">INCOTERM 2020:</span>
        <span class="field-value">${tradeDetails?.incoterm || '[INCOTERM]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">4. Delivery Terms</div>
      <div class="field">
        <span class="field-label">Shipment Period:</span>
        <span class="field-value">${additionalInfo?.shipmentPeriod || '[Shipment Period]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Loading Port:</span>
        <span class="field-value">${additionalInfo?.loadingPort || '[Port Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Destination Port:</span>
        <span class="field-value">${additionalInfo?.destinationPort || '[Port Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Partial Shipments:</span>
        <span class="field-value">${additionalInfo?.partialShipments || 'Not Allowed'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">5. Payment Terms</div>
      <div class="field">
        <span class="field-label">Payment Method:</span>
        <span class="field-value">${additionalInfo?.paymentMethod || 'Irrevocable Letter of Credit (LC)'}</span>
      </div>
      <div class="field">
        <span class="field-label">Payment Terms:</span>
        <span class="field-value">${additionalInfo?.paymentTerms || 'At sight'}</span>
      </div>
      <div class="field">
        <span class="field-label">Buyer's Bank:</span>
        <span class="field-value">${additionalInfo?.buyerBank || '[Bank Name]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">6. Inspection and Quality</div>
      <div class="field">
        <span class="field-label">Pre-shipment Inspection:</span>
        <span class="field-value">${additionalInfo?.inspector || 'SGS, Intertek, or Bureau Veritas'}</span>
      </div>
      <p style="padding-left: 20px; margin-top: 15px; font-weight: 600;">Certificates Required:</p>
      <ul>
        <li>Certificate of Quality</li>
        <li>Certificate of Quantity</li>
        <li>Certificate of Origin</li>
        <li>Full set of clean on board Bills of Lading</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">7. Next Steps</div>
      <p style="padding-left: 20px; line-height: 1.8; margin-bottom: 15px;">Upon acceptance of this LOI, the parties agree to:</p>
      <div class="indent">
        <p style="margin-bottom: 10px;"><strong>a)</strong> Execute a formal Sales and Purchase Agreement within <strong>${additionalInfo?.contractDays || '10 banking days'}</strong></p>
        <p style="margin-bottom: 10px;"><strong>b)</strong> Buyer to provide Proof of Funds (POF) within <strong>${additionalInfo?.pofDays || '3 banking days'}</strong></p>
        <p style="margin-bottom: 10px;"><strong>c)</strong> Seller to provide all required corporate documents and certificates</p>
        <p style="margin-bottom: 10px;"><strong>d)</strong> Buyer to establish Letter of Credit as per agreed terms</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">8. Validity and Binding Effect</div>
      <p style="padding-left: 20px; line-height: 1.8; text-align: justify;">This LOI is valid for <strong>${additionalInfo?.validity || '15 days'}</strong> from the date hereof and serves as a statement of mutual interest to proceed with the transaction. This LOI is non-binding until a formal Sales and Purchase Agreement is executed by both parties.</p>
    </div>

    <div class="section">
      <div class="section-title">9. Confidentiality</div>
      <p style="padding-left: 20px; line-height: 1.8; text-align: justify;">Both parties agree to treat all information exchanged in connection with this transaction as confidential and not to disclose such information to any third party without prior written consent.</p>
    </div>

    <div class="section">
      <div class="section-title">10. Governing Law</div>
      <p style="padding-left: 20px; line-height: 1.8;">This LOI shall be governed by and construed in accordance with the laws of <strong>${additionalInfo?.governingLaw || '[Jurisdiction]'}</strong>.</p>
    </div>

    <p style="margin: 30px 0; padding: 20px; background: #e8f5e9; border-left: 5px solid #4caf50; line-height: 1.8; text-align: justify;">We confirm our serious intent to proceed with this transaction subject to successful completion of due diligence and execution of definitive agreements.</p>

    <p style="margin: 35px 0 20px 0; line-height: 1.8;"><strong>Yours faithfully,</strong></p>

    <div class="signature-section">
      <p style="margin-bottom: 20px; font-weight: 600; font-size: 11pt;">FOR AND ON BEHALF OF BUYER:</p>
      
      <div class="signature-block">
        <div class="signature-line">
          AUTHORIZED SIGNATURE
        </div>
        
        <div style="margin-top: 25px;">
          <div class="field">
            <span class="field-label">Name:</span>
            <span class="field-value">${additionalInfo?.buyerSignatoryName || '[Name]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Title:</span>
            <span class="field-value">${additionalInfo?.buyerSignatoryTitle || '[Title]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Company:</span>
            <span class="field-value">${tradeDetails?.counterpartyName || '[Buyer Company]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Date:</span>
            <span class="field-value">${date}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="company-details">
      <p style="font-weight: bold; margin-bottom: 15px; font-size: 11.5pt; color: #2c3e50;">BUYER COMPANY DETAILS:</p>
      <div class="field">
        <span class="field-label">Registration Number:</span>
        <span class="field-value">${additionalInfo?.buyerRegistration || '[Registration Number]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Registered Address:</span>
        <span class="field-value">${additionalInfo?.buyerAddress || '[Company Address]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Phone:</span>
        <span class="field-value">${additionalInfo?.buyerPhone || '[Phone Number]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Email:</span>
        <span class="field-value">${additionalInfo?.buyerEmail || '[Email Address]'}</span>
      </div>
    </div>

    <div class="footer">
      <p>This document is confidential and intended solely for the use of the named recipient.<br>
      Unauthorized distribution, copying, or disclosure is strictly prohibited.<br>
      © ${new Date().getFullYear()} Commodity Trading Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generatePOF(
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
    @page { margin: 2.5cm; }
    body {
      font-family: 'Times New Roman', 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #000;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .document { max-width: 800px; margin: 0 auto; background: white; }
    .header {
      text-align: center;
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 3px double #1a1a1a;
    }
    .doc-title {
      font-size: 20pt;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .doc-subtitle { font-size: 10pt; color: #444; font-style: italic; }
    .date-ref {
      margin: 25px 0;
      padding: 15px 20px;
      background: #f8f8f8;
      border-left: 5px solid #2c3e50;
      font-size: 10.5pt;
    }
    .to-whom {
      margin: 30px 0;
      text-align: center;
      font-weight: bold;
      font-size: 12pt;
      letter-spacing: 1px;
    }
    .re-line {
      margin: 30px 0;
      padding: 15px;
      background: #e3f2fd;
      border-left: 5px solid #1976d2;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-box {
      margin: 25px 0;
      padding: 20px;
      background: #fafafa;
      border-radius: 3px;
      border: 1px solid #ddd;
    }
    .info-box-title {
      font-weight: bold;
      font-size: 11.5pt;
      color: #2c3e50;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field {
      margin-bottom: 12px;
      padding-left: 10px;
      line-height: 1.8;
    }
    .field-label {
      font-weight: 600;
      color: #2c3e50;
      display: inline-block;
      min-width: 220px;
    }
    .field-value { color: #000; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #34495e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .certification-list {
      margin: 20px 0;
      padding-left: 30px;
      line-height: 2;
    }
    .certification-list li {
      margin-bottom: 15px;
      text-align: justify;
    }
    .important-box {
      margin: 25px 0;
      padding: 20px;
      background: #fff9e6;
      border-left: 5px solid #f39c12;
      border-radius: 3px;
    }
    .important-box-title {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .important-box ul {
      margin: 0;
      padding-left: 25px;
      line-height: 1.9;
    }
    .important-box li { margin-bottom: 8px; }
    .signature-section {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #34495e;
      page-break-inside: avoid;
    }
    .signature-block {
      margin-top: 50px;
      padding: 20px;
      background: #fafafa;
      border-radius: 3px;
    }
    .signature-line {
      margin-top: 45px;
      margin-bottom: 10px;
      padding-top: 12px;
      border-top: 2px solid #000;
      max-width: 450px;
      font-weight: bold;
      font-size: 10pt;
    }
    .seal-box {
      margin-top: 30px;
      padding: 30px;
      border: 2px solid #333;
      text-align: center;
      font-weight: bold;
      background: #f5f5f5;
    }
    .disclaimer {
      margin-top: 40px;
      padding: 20px;
      background: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 3px;
      font-size: 10pt;
      line-height: 1.7;
      text-align: justify;
    }
    .footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 1px solid #bbb;
      text-align: center;
      font-size: 9pt;
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="doc-title">Proof of Funds</div>
      <div class="doc-subtitle">(POF)</div>
    </div>

    <div class="date-ref">
      <strong>Reference Number:</strong> POF-${Date.now()}<br>
      <strong>Date of Issue:</strong> ${date}
    </div>

    <div class="to-whom">TO WHOM IT MAY CONCERN</div>

    <div class="re-line">
      RE: PROOF OF FUNDS FOR ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[COMMODITY]'} TRANSACTION
    </div>

    <p style="text-align: justify; line-height: 1.8; margin: 25px 0;">This Proof of Funds letter is issued by <strong>${additionalInfo?.bankName || '[Bank Name]'}</strong> on behalf of our valued client:</p>

    <div class="info-box">
      <div class="info-box-title">Client Information:</div>
      <div class="field">
        <span class="field-label">Company Name:</span>
        <span class="field-value">${tradeDetails?.counterpartyName || '[Company Name]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Account Number:</span>
        <span class="field-value">${additionalInfo?.accountNumber || '[Account Number - Masked for Security]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Registration Number:</span>
        <span class="field-value">${additionalInfo?.registrationNumber || '[Registration Number]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Registered Address:</span>
        <span class="field-value">${additionalInfo?.companyAddress || '[Company Address]'}</span>
      </div>
    </div>

    <div class="info-box">
      <div class="info-box-title">Bank Information:</div>
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
        <span class="field-label">Bank License Number:</span>
        <span class="field-value">${additionalInfo?.bankLicense || '[License Number]'}</span>
      </div>
    </div>

    <div class="info-box">
      <div class="info-box-title">Transaction Details:</div>
      <div class="field">
        <span class="field-label">Purpose:</span>
        <span class="field-value">Purchase of ${tradeDetails?.commodity.replace(/_/g, ' ').toUpperCase() || '[Commodity]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Quantity:</span>
        <span class="field-value">${tradeDetails?.quantity.toLocaleString() || '[Quantity]'} ${tradeDetails?.unit || '[Unit]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Estimated Transaction Value:</span>
        <span class="field-value">${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Amount]'} USD</span>
      </div>
      <div class="field">
        <span class="field-label">Counterparty:</span>
        <span class="field-value">${additionalInfo?.sellerName || '[Seller Name]'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Certification</div>
      <p style="line-height: 1.8; margin-bottom: 20px;">We, <strong>${additionalInfo?.bankName || '[Bank Name]'}</strong>, hereby certify and confirm that:</p>
      
      <ol class="certification-list">
        <li>The above-named client maintains an active account with our institution in good standing.</li>
        
        <li>Our client has sufficient funds and/or approved credit facilities available to fulfill the financial obligations for the above-referenced transaction.</li>
        
        <li>The funds are unencumbered, of non-criminal origin, and free from any liens or legal restrictions that would prevent their use for this transaction.</li>
        
        <li>We confirm that funds totaling <strong>${tradeDetails ? (tradeDetails.quantity * tradeDetails.pricePerUnit).toLocaleString() : '[Amount]'} USD</strong> are available and can be transferred upon receipt of proper documentation and fulfillment of contract terms.</li>
        
        <li>This bank is ready, willing, and able to issue an Irrevocable Letter of Credit or effect payment via bank-to-bank transfer in accordance with the terms of the Sales and Purchase Agreement.</li>
        
        <li>All funds comply with international Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations.</li>
        
        <li>This bank is regulated by <strong>${additionalInfo?.regulator || '[Banking Regulatory Authority]'}</strong> and operates in full compliance with all applicable banking laws and international standards.</li>
      </ol>
    </div>

    <div class="important-box">
      <div class="important-box-title">Important Notes:</div>
      <ul>
        <li>This Proof of Funds is issued for the specific transaction referenced above</li>
        <li>This letter does not constitute a commitment to transfer funds</li>
        <li>Actual transfer of funds is subject to proper contract execution and documentation</li>
        <li>This POF is valid for <strong>${additionalInfo?.validity || '30 days'}</strong> from the date of issue</li>
        <li>This letter is confidential and intended solely for the transaction parties</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">Confidentiality</div>
      <p style="padding-left: 10px; line-height: 1.8; text-align: justify;">This Proof of Funds letter is issued in strict confidence and may only be used for the purpose stated above. Any unauthorized disclosure or use of this document is strictly prohibited.</p>
    </div>

    <div class="section">
      <div class="section-title">Validity</div>
      <p style="padding-left: 10px; line-height: 1.8;">This Proof of Funds letter is valid from <strong>${date}</strong> until <strong>${additionalInfo?.expiryDate || '[Expiry Date]'}</strong>.</p>
      
      <p style="padding-left: 10px; line-height: 1.8; margin-top: 20px;">For verification of this document, please contact our Corporate Banking Department:</p>
      <div class="field">
        <span class="field-label">Phone:</span>
        <span class="field-value">${additionalInfo?.bankPhone || '[Bank Phone]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Email:</span>
        <span class="field-value">${additionalInfo?.bankEmail || '[Bank Email]'}</span>
      </div>
      <div class="field">
        <span class="field-label">Reference:</span>
        <span class="field-value">POF-${Date.now()}</span>
      </div>
    </div>

    <p style="margin: 35px 0 20px 0; line-height: 1.8;"><strong>Yours faithfully,</strong></p>

    <div class="signature-section">
      <p style="margin-bottom: 20px; font-weight: 600; font-size: 11pt;">FOR AND ON BEHALF OF ${additionalInfo?.bankName || '[Bank Name]'}:</p>
      
      <div class="signature-block">
        <div class="signature-line">
          AUTHORIZED SIGNATURE
        </div>
        
        <div style="margin-top: 25px;">
          <div class="field">
            <span class="field-label">Name:</span>
            <span class="field-value">${additionalInfo?.bankOfficerName || '[Bank Officer Name]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Title:</span>
            <span class="field-value">${additionalInfo?.bankOfficerTitle || '[Title - e.g., Senior Vice President, Corporate Banking]'}</span>
          </div>
          <div class="field">
            <span class="field-label">Department:</span>
            <span class="field-value">Corporate Banking</span>
          </div>
          <div class="field">
            <span class="field-label">Date:</span>
            <span class="field-value">${date}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="seal-box">
      BANK OFFICIAL STAMP/SEAL
    </div>

    <div class="disclaimer">
      <strong>DISCLAIMER:</strong><br><br>
      This document is issued based on information provided by the client and the bank's internal records as of ${date}. The bank assumes no liability for the accuracy of transaction details provided by the client. This POF does not constitute a guarantee of payment and should not be construed as a financial commitment beyond certification of available funds.
    </div>

    <div class="footer">
      <p>This document is confidential and intended solely for the use of the named recipient.<br>
      Unauthorized distribution, copying, or disclosure is strictly prohibited.<br>
      © ${new Date().getFullYear()} ${additionalInfo?.bankName || '[Bank Name]'}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateNCNDA(
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
    @page { margin: 2.5cm; }
    body {
      font-family: 'Times New Roman', 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #000;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .document { max-width: 850px; margin: 0 auto; background: white; }
    .header {
      text-align: center;
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 3px double #1a1a1a;
    }
    .doc-title {
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .date-ref {
      margin: 25px 0;
      padding: 15px 20px;
      background: #f8f8f8;
      border-left: 5px solid #2c3e50;
      font-size: 10.5pt;
    }
    .parties-section {
      margin: 30px 0;
      padding: 25px;
      background: #fafafa;
      border: 1px solid #ddd;
      border-radius: 3px;
    }
    .party-block {
      margin-bottom: 20px;
      padding: 15px;
      background: #f0f4f8;
      border-left: 4px solid #34495e;
    }
    .party-title {
      font-weight: bold;
      font-size: 11.5pt;
      margin-bottom: 10px;
      text-transform: uppercase;
      color: #2c3e50;
    }
    .whereas-section {
      margin: 30px 0;
      padding: 20px;
      background: #fff9e6;
      border-left: 5px solid #f39c12;
      border-radius: 3px;
    }
    .whereas-title {
      font-weight: bold;
      font-size: 11.5pt;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .section { margin-bottom: 35px; page-break-inside: avoid; }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #34495e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .subsection {
      margin: 15px 0;
      padding-left: 20px;
      line-height: 1.9;
      text-align: justify;
    }
    .subsection-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .clause-list {
      margin: 10px 0;
      padding-left: 40px;
      line-height: 2;
    }
    .clause-list li {
      margin-bottom: 10px;
      text-align: justify;
    }
    .intro-text {
      margin: 25px 0;
      padding: 20px;
      background: #e8f5e9;
      border-left: 5px solid #4caf50;
      line-height: 1.8;
      text-align: justify;
    }
    .signature-section {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 3px double #34495e;
      page-break-inside: avoid;
    }
    .signature-block {
      margin: 40px 0;
      padding: 25px;
      background: #fafafa;
      border-radius: 3px;
      border: 1px solid #ddd;
    }
    .signature-line {
      margin: 30px 0 15px 0;
      padding-top: 12px;
      border-top: 2px solid #000;
      max-width: 400px;
      font-weight: bold;
    }
    .signature-field {
      margin: 10px 0;
      line-height: 1.8;
    }
    .signature-field strong {
      display: inline-block;
      min-width: 120px;
      color: #2c3e50;
    }
    .witness-section {
      margin-top: 50px;
      padding: 25px;
      background: #f5f5f5;
      border-radius: 3px;
    }
    .witness-block {
      margin: 25px 0;
    }
    .footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 1px solid #bbb;
      text-align: center;
      font-size: 9pt;
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="doc-title">Non-Circumvention and Non-Disclosure Agreement</div>
      <div style="font-size: 10pt; color: #444; font-style: italic;">(NCNDA)</div>
    </div>

    <div class="date-ref">
      <strong>Reference Number:</strong> NCNDA-${Date.now()}<br>
      <strong>Date of Agreement:</strong> ${date}
    </div>

    <p style="text-align: justify; line-height: 1.8; margin: 25px 0;">This Non-Circumvention and Non-Disclosure Agreement ("Agreement") is entered into on <strong>${date}</strong> by and between:</p>

    <div class="parties-section">
      <div class="party-block">
        <div class="party-title">Party A ("Disclosing Party"):</div>
        <div style="padding-left: 15px; line-height: 1.8;">
          <strong>Company Name:</strong> ${additionalInfo?.partyAName || '[Party A Company Name]'}<br>
          <strong>Registration Number:</strong> ${additionalInfo?.partyARegistration || '[Registration Number]'}<br>
          <strong>Address:</strong> ${additionalInfo?.partyAAddress || '[Company Address]'}<br>
          <strong>Represented by:</strong> ${additionalInfo?.partyARepresentative || '[Name and Title]'}
        </div>
      </div>

      <div style="text-align: center; font-weight: bold; margin: 20px 0; font-size: 11pt;">AND</div>

      <div class="party-block">
        <div class="party-title">Party B ("Receiving Party"):</div>
        <div style="padding-left: 15px; line-height: 1.8;">
          <strong>Company Name:</strong> ${additionalInfo?.partyBName || tradeDetails?.counterpartyName || '[Party B Company Name]'}<br>
          <strong>Registration Number:</strong> ${additionalInfo?.partyBRegistration || '[Registration Number]'}<br>
          <strong>Address:</strong> ${additionalInfo?.partyBAddress || '[Company Address]'}<br>
          <strong>Represented by:</strong> ${additionalInfo?.partyBRepresentative || '[Name and Title]'}
        </div>
      </div>

      <p style="margin-top: 20px; text-align: center; font-style: italic;">Collectively referred to as the "Parties" and individually as a "Party."</p>
    </div>

    <div class="whereas-section">
      <div class="whereas-title">Whereas:</div>
      <p style="margin-bottom: 15px; line-height: 1.8; text-align: justify;"><strong>A.</strong> The Parties wish to engage in discussions and business transactions related to <strong>${tradeDetails?.commodity ? tradeDetails.commodity.replace(/_/g, ' ').toUpperCase() : '[Commodity/Business Activity]'}</strong>.</p>
      <p style="margin-bottom: 15px; line-height: 1.8; text-align: justify;"><strong>B.</strong> In connection with such discussions and transactions, each Party may disclose to the other Party certain confidential and proprietary information.</p>
      <p style="margin-bottom: 0; line-height: 1.8; text-align: justify;"><strong>C.</strong> The Parties desire to protect the confidentiality of such information and establish terms to prevent circumvention in their business dealings.</p>
    </div>

    <div class="intro-text">
      <strong>NOW, THEREFORE,</strong> in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:
    </div>

    <div class="section">
      <div class="section-title">1. Non-Disclosure</div>
      
      <div class="subsection">
        <div class="subsection-title">1.1 Definition of Confidential Information</div>
        <p>"Confidential Information" means any and all information disclosed by one Party to the other Party, whether orally, in writing, electronically, or by any other means, including but not limited to:</p>
        <ul class="clause-list">
          <li>Business plans, strategies, and methods</li>
          <li>Financial information, pricing, and terms</li>
          <li>Customer and supplier lists and contacts</li>
          <li>Technical data and specifications</li>
          <li>Trade secrets and proprietary information</li>
          <li>Market analyses and business opportunities</li>
          <li>Contract terms and negotiations</li>
          <li>Any information marked as "Confidential" or which would reasonably be considered confidential</li>
        </ul>
      </div>

      <div class="subsection">
        <div class="subsection-title">1.2 Obligations</div>
        <p>Each Party agrees to:</p>
        <ul class="clause-list">
          <li>Keep all Confidential Information strictly confidential</li>
          <li>Not disclose Confidential Information to any third party without prior written consent</li>
          <li>Use Confidential Information solely for the purpose of evaluating and conducting the proposed business transaction</li>
          <li>Protect Confidential Information with the same degree of care used to protect its own confidential information, but in no event less than reasonable care</li>
          <li>Limit access to Confidential Information to employees, agents, or advisors who have a legitimate need to know and who are bound by confidentiality obligations</li>
        </ul>
      </div>

      <div class="subsection">
        <div class="subsection-title">1.3 Exceptions</div>
        <p>Confidential Information does not include information that:</p>
        <ul class="clause-list">
          <li>Was publicly known at the time of disclosure</li>
          <li>Becomes publicly known through no breach of this Agreement</li>
          <li>Was rightfully in the possession of the Receiving Party prior to disclosure</li>
          <li>Is independently developed by the Receiving Party without use of the Confidential Information</li>
          <li>Is rightfully received from a third party without breach of any confidentiality obligation</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">2. Non-Circumvention</div>
      
      <div class="subsection">
        <div class="subsection-title">2.1 Circumvention Prohibition</div>
        <p>Each Party agrees not to circumvent, avoid, bypass, or obviate the other Party by:</p>
        <ul class="clause-list">
          <li>Directly or indirectly contacting, dealing with, or entering into any agreement with any party, contact, or source of supply introduced or disclosed by the other Party</li>
          <li>Using Confidential Information to contact or deal with any such parties for any business purpose</li>
          <li>Attempting to gain any financial benefit or advantage from such contacts without the full involvement and written consent of the introducing Party</li>
        </ul>
      </div>

      <div class="subsection">
        <div class="subsection-title">2.2 Scope of Application</div>
        <p>The non-circumvention obligations shall apply to:</p>
        <ul class="clause-list">
          <li>All contacts, clients, suppliers, financiers, or other parties introduced by either Party</li>
          <li>All business opportunities arising from such introductions</li>
          <li>Any transactions, agreements, or arrangements resulting from such introductions</li>
        </ul>
      </div>

      <div class="subsection">
        <div class="subsection-title">2.3 Rights of Introducing Party</div>
        <p>In the event of any transaction with an introduced party, the introducing Party shall be entitled to:</p>
        <ul class="clause-list">
          <li>Full participation in such transaction as agreed between the Parties</li>
          <li>Commission or fees as per separate agreement</li>
          <li>Full disclosure of all terms and conditions</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">3. Term and Termination</div>
      
      <div class="subsection">
        <p><strong>3.1</strong> This Agreement shall commence on the date first written above and shall continue for a period of <strong>${additionalInfo?.termYears || '5 (five)'} years</strong>.</p>
      </div>

      <div class="subsection">
        <p><strong>3.2</strong> The obligations of confidentiality and non-circumvention shall survive the termination of this Agreement and continue for an additional <strong>${additionalInfo?.postTermYears || '5 (five)'} years</strong>.</p>
      </div>

      <div class="subsection">
        <p><strong>3.3</strong> Either Party may terminate this Agreement upon <strong>${additionalInfo?.noticePeriod || '30 days'}</strong> written notice to the other Party, provided that all obligations under this Agreement shall survive such termination as specified herein.</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">4. Remedies</div>
      
      <div class="subsection">
        <p><strong>4.1</strong> The Parties acknowledge that breach of this Agreement would cause irreparable harm for which monetary damages would be an inadequate remedy.</p>
      </div>

      <div class="subsection">
        <p><strong>4.2</strong> In the event of breach or threatened breach, the non-breaching Party shall be entitled to:</p>
        <ul class="clause-list">
          <li>Immediate injunctive relief without the necessity of posting bond</li>
          <li>Recovery of all costs and expenses, including reasonable attorney's fees</li>
          <li>Any other remedies available at law or in equity</li>
        </ul>
      </div>

      <div class="subsection">
        <p><strong>4.3</strong> In the event of circumvention, the circumventing Party shall be liable to pay:</p>
        <ul class="clause-list">
          <li>All commissions, fees, or benefits that would have accrued to the circumvented Party</li>
          <li>Liquidated damages of <strong>${additionalInfo?.liquidatedDamages || '[Amount]'}</strong></li>
          <li>Any actual damages proven by the circumvented Party</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">5. Return of Information</div>
      
      <div class="subsection">
        <p><strong>5.1</strong> Upon termination of this Agreement or upon request by the Disclosing Party, the Receiving Party shall:</p>
        <ul class="clause-list">
          <li>Promptly return all Confidential Information in tangible form</li>
          <li>Permanently delete all electronic copies of Confidential Information</li>
          <li>Certify in writing that all such information has been returned or destroyed</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">6. No License or Transfer</div>
      
      <div class="subsection">
        <p><strong>6.1</strong> Nothing in this Agreement grants any license, right, title, or interest in any Confidential Information, intellectual property, patents, trademarks, or copyrights.</p>
      </div>

      <div class="subsection">
        <p><strong>6.2</strong> All Confidential Information remains the sole property of the Disclosing Party.</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">7. No Obligation</div>
      
      <div class="subsection">
        <p><strong>7.1</strong> This Agreement does not obligate either Party to:</p>
        <ul class="clause-list">
          <li>Disclose any particular information</li>
          <li>Enter into any business transaction or relationship</li>
          <li>Continue discussions beyond what either Party deems appropriate</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">8. Representations and Warranties</div>
      
      <div class="subsection">
        <p><strong>8.1</strong> Each Party represents and warrants that:</p>
        <ul class="clause-list">
          <li>It has full authority to enter into this Agreement</li>
          <li>This Agreement is legally binding upon it</li>
          <li>Execution of this Agreement does not violate any other agreement or obligation</li>
          <li>Its representatives are authorized to act on its behalf</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-title">9. Governing Law and Jurisdiction</div>
      
      <div class="subsection">
        <p><strong>9.1</strong> This Agreement shall be governed by and construed in accordance with the laws of <strong>${additionalInfo?.governingLaw || '[Jurisdiction]'}</strong>, without regard to its conflict of law provisions.</p>
      </div>

      <div class="subsection">
        <p><strong>9.2</strong> Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of <strong>${additionalInfo?.jurisdiction || '[Jurisdiction]'}</strong>.</p>
      </div>

      <div class="subsection">
        <p><strong>9.3</strong> The Parties agree to first attempt resolution of disputes through good faith negotiations before initiating legal proceedings.</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">10. General Provisions</div>
      
      <div class="subsection">
        <p><strong>10.1 Entire Agreement:</strong> This Agreement constitutes the entire agreement between the Parties concerning its subject matter and supersedes all prior agreements and understandings.</p>
      </div>

      <div class="subsection">
        <p><strong>10.2 Amendments:</strong> This Agreement may only be amended by written agreement signed by both Parties.</p>
      </div>

      <div class="subsection">
        <p><strong>10.3 Waiver:</strong> No waiver of any provision shall be deemed or constitute a waiver of any other provision.</p>
      </div>

      <div class="subsection">
        <p><strong>10.4 Severability:</strong> If any provision is found invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
      </div>

      <div class="subsection">
        <p><strong>10.5 Assignment:</strong> Neither Party may assign this Agreement without the prior written consent of the other Party.</p>
      </div>

      <div class="subsection">
        <p><strong>10.6 Notices:</strong> All notices shall be in writing and delivered to the addresses set forth above or such other addresses as may be designated in writing.</p>
      </div>

      <div class="subsection">
        <p><strong>10.7 Counterparts:</strong> This Agreement may be executed in counterparts, each of which shall be deemed an original.</p>
      </div>
    </div>

    <div class="signature-section">
      <p style="text-align: center; font-weight: bold; font-size: 11pt; margin-bottom: 30px;">IN WITNESS WHEREOF, the Parties have executed this Non-Circumvention and Non-Disclosure Agreement as of the date first written above.</p>

      <div class="signature-block">
        <div style="font-weight: bold; font-size: 11.5pt; margin-bottom: 20px; color: #2c3e50;">PARTY A (Disclosing Party):</div>
        
        <div class="signature-line">AUTHORIZED SIGNATURE</div>
        
        <div style="margin-top: 20px;">
          <div class="signature-field"><strong>Name:</strong> ${additionalInfo?.partyASignatoryName || '[Name]'}</div>
          <div class="signature-field"><strong>Title:</strong> ${additionalInfo?.partyASignatoryTitle || '[Title]'}</div>
          <div class="signature-field"><strong>Company:</strong> ${additionalInfo?.partyAName || '[Party A Company Name]'}</div>
          <div class="signature-field"><strong>Date:</strong> ${date}</div>
          <div class="signature-field"><strong>Company Seal:</strong> [SEAL]</div>
        </div>
      </div>

      <div class="signature-block">
        <div style="font-weight: bold; font-size: 11.5pt; margin-bottom: 20px; color: #2c3e50;">PARTY B (Receiving Party):</div>
        
        <div class="signature-line">AUTHORIZED SIGNATURE</div>
        
        <div style="margin-top: 20px;">
          <div class="signature-field"><strong>Name:</strong> ${additionalInfo?.partyBSignatoryName || '[Name]'}</div>
          <div class="signature-field"><strong>Title:</strong> ${additionalInfo?.partyBSignatoryTitle || '[Title]'}</div>
          <div class="signature-field"><strong>Company:</strong> ${additionalInfo?.partyBName || tradeDetails?.counterpartyName || '[Party B Company Name]'}</div>
          <div class="signature-field"><strong>Date:</strong> ${date}</div>
          <div class="signature-field"><strong>Company Seal:</strong> [SEAL]</div>
        </div>
      </div>

      <div class="witness-section">
        <div style="font-weight: bold; font-size: 11.5pt; margin-bottom: 20px; color: #2c3e50; text-align: center;">WITNESSES:</div>
        
        <div class="witness-block">
          <div style="font-weight: 600; margin-bottom: 10px;">Witness 1:</div>
          <div class="signature-line">SIGNATURE</div>
          <div class="signature-field"><strong>Name:</strong> ${additionalInfo?.witness1Name || '[Name]'}</div>
          <div class="signature-field"><strong>Date:</strong> ${date}</div>
        </div>

        <div class="witness-block">
          <div style="font-weight: 600; margin-bottom: 10px;">Witness 2:</div>
          <div class="signature-line">SIGNATURE</div>
          <div class="signature-field"><strong>Name:</strong> ${additionalInfo?.witness2Name || '[Name]'}</div>
          <div class="signature-field"><strong>Date:</strong> ${date}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>This document is confidential and intended solely for the use of the named parties.<br>
      Unauthorized distribution, copying, or disclosure is strictly prohibited.<br>
      © ${new Date().getFullYear()} Commodity Trading Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
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
