import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  UnderlineType,
  Packer
} from 'docx';

type DocumentType = 'CIS' | 'SCO' | 'FCO' | 'ICPO' | 'LOI' | 'POF' | 'RWA' | 'BCL' | 'NCNDA' | 'IMFPA' | 'TSA' | 'SPA' | 'ASWP' | 'POP' | 'BOL' | 'COO' | 'QUALITY_CERT';

const MIDNIGHT_BLUE = "1E3A5F";
const LIGHT_GRAY = "F5F5F5";

function createBlankLine(label: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: label,
        bold: true,
        size: 22,
      }),
      new TextRun({
        text: " _____________________________________________",
        size: 22,
      }),
    ],
    spacing: { after: 200 },
  });
}

function createSectionTitle(title: string): Paragraph {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 200 },
    border: {
      bottom: {
        color: MIDNIGHT_BLUE,
        space: 1,
        style: BorderStyle.SINGLE,
        size: 12,
      },
    },
    shading: {
      fill: LIGHT_GRAY,
    },
  });
}

function createDocumentHeader(title: string, subtitle: string): Paragraph[] {
  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      shading: {
        fill: MIDNIGHT_BLUE,
      },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: subtitle,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Document Date: ",
          bold: true,
        }),
        new TextRun({
          text: "_______________________",
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Reference Number: ",
          bold: true,
        }),
        new TextRun({
          text: "_______________________",
        }),
      ],
      spacing: { after: 300 },
    }),
  ];
}

function generateCISDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "CORPORATE INFORMATION SHEET",
          "(CIS)"
        ),
        
        createSectionTitle("1. CORPORATE DETAILS"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Date of Incorporation:"),
        createBlankLine("Country of Registration:"),
        
        createSectionTitle("2. REGISTERED ADDRESS"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Full Registered Address:",
              bold: true,
              size: 22,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 200 },
        }),
        
        createSectionTitle("3. CONTACT INFORMATION"),
        createBlankLine("Phone:"),
        createBlankLine("Email:"),
        createBlankLine("Website:"),
        createBlankLine("Fax:"),
        
        createSectionTitle("4. AUTHORIZED REPRESENTATIVES"),
        createBlankLine("Representative Name:"),
        createBlankLine("Title/Position:"),
        createBlankLine("Contact Number:"),
        createBlankLine("Email Address:"),
        
        createSectionTitle("5. BANKING INFORMATION"),
        createBlankLine("Bank Name:"),
        createBlankLine("Bank Address:"),
        createBlankLine("SWIFT/BIC Code:"),
        createBlankLine("Account Number:"),
        createBlankLine("Account Holder Name:"),
        
        createSectionTitle("6. TRADE LICENSES & CERTIFICATIONS"),
        new Paragraph({
          text: "Please list all relevant trade licenses and certifications:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 200 },
        }),
        
        createSectionTitle("7. COMMODITY TRADING EXPERIENCE"),
        createBlankLine("Years in Business:"),
        createBlankLine("Primary Commodities Traded:"),
        createBlankLine("Annual Trading Volume:"),
        createBlankLine("Major Trading Partners/Countries:"),
        
        createSectionTitle("8. SIGNATURE SECTION"),
        new Paragraph({
          text: "",
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Signatory Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL/STAMP]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateSCODocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "SOFT CORPORATE OFFER",
          "(SCO) - Non-Binding Commercial Offer"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "FROM (Seller): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "TO (Buyer): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "Dear Sir/Madam,",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "We, the undersigned, hereby confirm with full corporate responsibility that we are ready, willing, and able to supply the following commodity under the terms and conditions stated below:",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("1. COMMODITY DETAILS"),
        createBlankLine("Product/Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Unit of Measurement:"),
        createBlankLine("Quality Specification:"),
        createBlankLine("Country of Origin:"),
        createBlankLine("Packing:"),
        
        createSectionTitle("2. PRICING"),
        createBlankLine("Unit Price (USD):"),
        createBlankLine("Total Contract Value (USD):"),
        createBlankLine("Price Basis:"),
        createBlankLine("Price Validity:"),
        
        createSectionTitle("3. DELIVERY TERMS"),
        createBlankLine("INCOTERM 2020:"),
        createBlankLine("Delivery Schedule/Period:"),
        createBlankLine("Loading Port:"),
        createBlankLine("Discharge/Destination Port:"),
        createBlankLine("Partial Shipments:"),
        createBlankLine("Transshipment:"),
        
        createSectionTitle("4. PAYMENT TERMS"),
        createBlankLine("Payment Method:"),
        createBlankLine("Payment Terms:"),
        createBlankLine("Bank Name:"),
        createBlankLine("Bank Address:"),
        createBlankLine("SWIFT Code:"),
        
        createSectionTitle("5. INSPECTION & QUALITY CONTROL"),
        createBlankLine("Pre-shipment Inspector:"),
        createBlankLine("Quality Certificate Required:"),
        createBlankLine("Quantity Certificate Required:"),
        createBlankLine("Inspection Costs Borne By:"),
        
        createSectionTitle("6. REQUIRED DOCUMENTS"),
        new Paragraph({
          text: "☐ Commercial Invoice",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Bill of Lading",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Origin",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quality",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quantity",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Packing List",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Other: _____________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("7. VALIDITY"),
        createBlankLine("This Soft Corporate Offer is valid for:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IMPORTANT: This offer is non-binding and subject to final contract negotiation and execution.",
              italics: true,
              bold: true,
            }),
          ],
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("8. SIGNATURE SECTION"),
        new Paragraph({
          text: "Yours faithfully,",
          spacing: { before: 200, after: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL/STAMP]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateICPODocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "IRREVOCABLE CORPORATE PURCHASE ORDER",
          "(ICPO)"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "FROM (Buyer): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "TO (Seller): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "Dear Sir/Madam,",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "We, the undersigned, as buyers, hereby issue this Irrevocable Corporate Purchase Order with full corporate and financial responsibility to purchase the following commodity under the terms and conditions specified herein:",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("1. COMMODITY SPECIFICATION"),
        createBlankLine("Product/Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Unit of Measurement:"),
        createBlankLine("Quality Specification:"),
        createBlankLine("Country of Origin:"),
        createBlankLine("Packing Requirements:"),
        
        createSectionTitle("2. PRICE AND PAYMENT"),
        createBlankLine("Unit Price (USD):"),
        createBlankLine("Total Contract Value (USD):"),
        createBlankLine("Currency:"),
        createBlankLine("Payment Method:"),
        createBlankLine("Payment Terms:"),
        createBlankLine("Letter of Credit Type:"),
        
        createSectionTitle("3. DELIVERY TERMS"),
        createBlankLine("INCOTERM 2020:"),
        createBlankLine("Shipment Period:"),
        createBlankLine("Partial Shipments:"),
        createBlankLine("Transshipment:"),
        createBlankLine("Loading Port:"),
        createBlankLine("Destination Port:"),
        
        createSectionTitle("4. INSPECTION AND CERTIFICATION"),
        createBlankLine("Pre-shipment Inspection By:"),
        createBlankLine("Quality Certificate:"),
        createBlankLine("Quantity Certificate:"),
        createBlankLine("Inspection Costs Borne By:"),
        
        createSectionTitle("5. REQUIRED DOCUMENTS"),
        new Paragraph({
          text: "☐ Commercial Invoice (Original + 3 copies)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Full Set Clean on Board Bill of Lading",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Origin",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quality",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quantity",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Packing List",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Insurance Certificate (if applicable)",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("6. BUYER'S BANKING DETAILS"),
        createBlankLine("Buyer's Bank:"),
        createBlankLine("Bank Address:"),
        createBlankLine("SWIFT Code:"),
        createBlankLine("Account Number:"),
        
        createSectionTitle("7. VALIDITY"),
        createBlankLine("This ICPO is valid until:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "DECLARATION: We confirm that we have the financial capability and full authority to fulfill this purchase order and enter into a binding agreement for the transaction specified herein.",
              italics: true,
              bold: true,
            }),
          ],
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("8. BUYER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "FOR AND ON BEHALF OF BUYER:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        createBlankLine("Phone:"),
        createBlankLine("Email:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL/STAMP]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateLOIDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "LETTER OF INTENT",
          "(LOI)"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "FROM (Buyer): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "TO (Seller): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "Dear Sir/Madam,",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "RE: LETTER OF INTENT TO PURCHASE ",
              bold: true,
            }),
            new TextRun({
              text: "______________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "This Letter of Intent (\"LOI\") sets forth the understanding between the parties regarding the proposed transaction for the purchase and sale of the commodity specified below.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("1. PARTIES"),
        createBlankLine("Buyer:"),
        createBlankLine("Seller:"),
        
        createSectionTitle("2. COMMODITY DESCRIPTION"),
        createBlankLine("Product/Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Unit of Measurement:"),
        createBlankLine("Quality Specification:"),
        createBlankLine("Country of Origin:"),
        
        createSectionTitle("3. COMMERCIAL TERMS"),
        createBlankLine("Unit Price (USD):"),
        createBlankLine("Total Contract Value (USD):"),
        createBlankLine("Price Basis:"),
        createBlankLine("INCOTERM 2020:"),
        
        createSectionTitle("4. DELIVERY TERMS"),
        createBlankLine("Shipment Period:"),
        createBlankLine("Loading Port:"),
        createBlankLine("Destination Port:"),
        createBlankLine("Partial Shipments:"),
        
        createSectionTitle("5. PAYMENT TERMS"),
        createBlankLine("Payment Method:"),
        createBlankLine("Payment Terms:"),
        createBlankLine("Buyer's Bank:"),
        
        createSectionTitle("6. INSPECTION AND QUALITY"),
        createBlankLine("Pre-shipment Inspector:"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Certificates Required:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quality",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quantity",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Origin",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Full set of clean on board Bills of Lading",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("7. NEXT STEPS"),
        new Paragraph({
          text: "Upon acceptance of this LOI, the parties agree to:",
          spacing: { after: 100 },
        }),
        createBlankLine("a) Execute formal Sales and Purchase Agreement within:"),
        createBlankLine("b) Buyer to provide Proof of Funds (POF) within:"),
        createBlankLine("c) Seller to provide corporate documents within:"),
        createBlankLine("d) Buyer to establish Letter of Credit within:"),
        
        createSectionTitle("8. VALIDITY AND BINDING EFFECT"),
        createBlankLine("This LOI is valid for:"),
        new Paragraph({
          children: [
            new TextRun({
              text: "This LOI is non-binding until a formal Sales and Purchase Agreement is executed by both parties.",
              italics: true,
            }),
          ],
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("9. CONFIDENTIALITY"),
        new Paragraph({
          text: "Both parties agree to treat all information exchanged in connection with this transaction as confidential and not to disclose such information to any third party without prior written consent.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("10. GOVERNING LAW"),
        createBlankLine("Governing Jurisdiction:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "We confirm our serious intent to proceed with this transaction subject to successful completion of due diligence and execution of definitive agreements.",
              italics: true,
              bold: true,
            }),
          ],
          spacing: { before: 300, after: 300 },
        }),
        
        new Paragraph({
          text: "Yours faithfully,",
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("11. BUYER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "FOR AND ON BEHALF OF BUYER:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        createBlankLine("Phone:"),
        createBlankLine("Email:"),
        createBlankLine("Date:"),
      ],
    }],
  });
}

function generatePOFDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "PROOF OF FUNDS",
          "(POF) - Bank Certification Letter"
        ),
        
        new Paragraph({
          text: "TO WHOM IT MAY CONCERN",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "RE: PROOF OF FUNDS FOR ",
              bold: true,
            }),
            new TextRun({
              text: "______________________________",
            }),
            new TextRun({
              text: " TRANSACTION",
              bold: true,
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "This Proof of Funds letter is issued by the undersigned bank on behalf of our valued client:",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("CLIENT INFORMATION"),
        createBlankLine("Company Name:"),
        createBlankLine("Account Number:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("BANK INFORMATION"),
        createBlankLine("Bank Name:"),
        createBlankLine("Bank Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("SWIFT/BIC Code:"),
        createBlankLine("Bank License Number:"),
        createBlankLine("Regulatory Authority:"),
        
        createSectionTitle("TRANSACTION DETAILS"),
        createBlankLine("Transaction Purpose:"),
        createBlankLine("Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Estimated Transaction Value (USD):"),
        createBlankLine("Counterparty/Seller:"),
        
        createSectionTitle("BANK CERTIFICATION"),
        new Paragraph({
          children: [
            new TextRun({
              text: "We, the undersigned bank, hereby certify and confirm that:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "☐ The above-named client maintains an active account with our institution in good standing.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "☐ Our client has sufficient funds and/or approved credit facilities available to fulfill the financial obligations for the above-referenced transaction.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "☐ The funds are unencumbered, of non-criminal origin, and free from any liens or legal restrictions.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "☐ We confirm that funds totaling USD ",
            }),
            new TextRun({
              text: "____________________",
            }),
            new TextRun({
              text: " are available and can be transferred upon receipt of proper documentation.",
            }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "☐ This bank is ready, willing, and able to issue an Irrevocable Letter of Credit or effect payment via bank-to-bank transfer.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "☐ All funds comply with international Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("IMPORTANT NOTES"),
        new Paragraph({
          text: "• This Proof of Funds is issued for the specific transaction referenced above",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• This letter does not constitute a commitment to transfer funds",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Actual transfer of funds is subject to proper contract execution and documentation",
          spacing: { after: 100 },
        }),
        createBlankLine("• This POF is valid for:"),
        new Paragraph({
          text: "• This letter is confidential and intended solely for the transaction parties",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("VALIDITY AND VERIFICATION"),
        createBlankLine("Valid From:"),
        createBlankLine("Valid Until:"),
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "For verification of this document, please contact:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Phone:"),
        createBlankLine("Email:"),
        createBlankLine("Reference Number:"),
        
        new Paragraph({
          text: "Yours faithfully,",
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("BANK OFFICER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Bank Officer Name:"),
        createBlankLine("Title:"),
        createBlankLine("Department:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[BANK OFFICIAL STAMP/SEAL]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 100 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateNCNDADocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "NON-CIRCUMVENTION AND NON-DISCLOSURE AGREEMENT",
          "(NCNDA)"
        ),
        
        new Paragraph({
          text: "This Non-Circumvention and Non-Disclosure Agreement (\"Agreement\") is entered into on:",
          spacing: { after: 100 },
        }),
        createBlankLine("Date:"),
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "BY AND BETWEEN:",
              bold: true,
            }),
          ],
          spacing: { after: 200 },
        }),
        
        createSectionTitle("PARTY A (Disclosing Party)"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Represented by:"),
        createBlankLine("Title:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "AND",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("PARTY B (Receiving Party)"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Represented by:"),
        createBlankLine("Title:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "(Collectively referred to as the \"Parties\" and individually as a \"Party\")",
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("WHEREAS"),
        new Paragraph({
          text: "A. The Parties wish to engage in discussions and business transactions related to:",
          spacing: { after: 100 },
        }),
        createBlankLine("Business Activity/Commodity:"),
        new Paragraph({
          text: "B. In connection with such discussions and transactions, each Party may disclose to the other Party certain confidential and proprietary information.",
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "C. The Parties desire to protect the confidentiality of such information and establish terms to prevent circumvention in their business dealings.",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows:",
              bold: true,
            }),
          ],
          spacing: { after: 300 },
        }),
        
        createSectionTitle("1. NON-DISCLOSURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "1.1 Definition of Confidential Information",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "\"Confidential Information\" means any and all information disclosed by one Party to the other Party, including but not limited to: business plans, financial information, customer and supplier lists, technical data, trade secrets, market analyses, and any information marked as \"Confidential.\"",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "1.2 Obligations",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Each Party agrees to:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Keep all Confidential Information strictly confidential",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Not disclose Confidential Information to any third party without prior written consent",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Use Confidential Information solely for the purpose of evaluating the proposed business transaction",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Protect Confidential Information with reasonable care",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("2. NON-CIRCUMVENTION"),
        new Paragraph({
          children: [
            new TextRun({
              text: "2.1 Circumvention Prohibition",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Each Party agrees not to circumvent, avoid, bypass, or obviate the other Party by:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Directly or indirectly contacting any party, contact, or source of supply introduced by the other Party",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Using Confidential Information to contact or deal with any such parties",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Attempting to gain any financial benefit without the full involvement of the introducing Party",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("3. TERM AND TERMINATION"),
        createBlankLine("3.1 Initial Term (years):"),
        createBlankLine("3.2 Post-Termination Obligations (years):"),
        createBlankLine("3.3 Termination Notice Period (days):"),
        
        createSectionTitle("4. REMEDIES"),
        new Paragraph({
          text: "4.1 The Parties acknowledge that breach of this Agreement would cause irreparable harm for which monetary damages would be an inadequate remedy.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "4.2 In the event of breach, the non-breaching Party shall be entitled to:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Immediate injunctive relief",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Recovery of all costs and expenses, including attorney's fees",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Any other remedies available at law or in equity",
          spacing: { after: 200 },
        }),
        createBlankLine("4.3 Liquidated Damages Amount:"),
        
        createSectionTitle("5. GOVERNING LAW AND JURISDICTION"),
        createBlankLine("Governing Law (Jurisdiction):"),
        createBlankLine("Exclusive Jurisdiction (Courts):"),
        
        createSectionTitle("6. GENERAL PROVISIONS"),
        new Paragraph({
          text: "• This Agreement constitutes the entire agreement between the Parties",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• This Agreement may only be amended by written agreement signed by both Parties",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Neither Party may assign this Agreement without prior written consent",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• If any provision is found invalid, the remaining provisions shall continue in full force",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("PARTY A SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL]",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("PARTY B SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL]",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("WITNESSES"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Witness 1:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Signature: _______________________________"),
        createBlankLine("Name:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Witness 2:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Signature: _______________________________"),
        createBlankLine("Name:"),
        createBlankLine("Date:"),
      ],
    }],
  });
}

function generateIMFPADocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "IRREVOCABLE MASTER FEE PROTECTION AGREEMENT",
          "(IMFPA)"
        ),
        
        new Paragraph({
          text: "This Irrevocable Master Fee Protection Agreement (\"Agreement\") is entered into on:",
          spacing: { after: 100 },
        }),
        createBlankLine("Effective Date:"),
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "BY AND BETWEEN:",
              bold: true,
            }),
          ],
          spacing: { after: 200 },
        }),
        
        createSectionTitle("SELLER"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Represented by:"),
        createBlankLine("Title:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "AND",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("BUYER"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Represented by:"),
        createBlankLine("Title:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "(Collectively referred to as the \"Parties\" and individually as a \"Party\")",
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("RECITALS"),
        new Paragraph({
          text: "WHEREAS, the Parties are engaged in or facilitating commodity trading transactions involving:",
          spacing: { after: 100 },
        }),
        createBlankLine("Commodity:"),
        new Paragraph({
          text: "WHEREAS, certain Parties may introduce buyers, sellers, suppliers, or other parties and are entitled to protection of their commercial interests and fees;",
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows:",
              bold: true,
            }),
          ],
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 1: DEFINITIONS"),
        new Paragraph({
          text: "1.1 \"Transaction\" means any business transaction involving the commodity specified above.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "1.2 \"Intermediary\" means any Party who introduces or arranges contact between parties.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "1.3 \"Protected Party\" means any Intermediary entitled to fees or commissions.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "1.4 \"Commission\" means the fees or compensation payable to a Protected Party.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 2: SCOPE AND PURPOSE"),
        new Paragraph({
          text: "2.1 This Agreement establishes the rights of each Party to receive fees and commissions for Transactions they facilitate.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "2.2 Coverage: This Agreement covers all Transactions involving parties introduced by any Protected Party.",
          spacing: { after: 150 },
        }),
        createBlankLine("2.3 Term (years):"),
        
        createSectionTitle("ARTICLE 3: FEE PROTECTION OBLIGATIONS"),
        new Paragraph({
          children: [
            new TextRun({
              text: "3.1 Non-Circumvention: Each Party agrees not to:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Circumvent, bypass, or avoid any Protected Party in Transactions",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Directly contact parties introduced by another Party without full involvement",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Enter into any Transaction without proper commission payments",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "3.2 Commission Guarantee: All Protected Parties are entitled to receive commissions on initial and subsequent Transactions.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 4: COMMISSION STRUCTURE"),
        createBlankLine("4.1 Standard Commission Rate (%):"),
        createBlankLine("4.2 Basis of Calculation:"),
        createBlankLine("4.3 Payment Timing (days after receipt):"),
        createBlankLine("4.4 Payment Method:"),
        createBlankLine("4.5 Currency:"),
        createBlankLine("4.6 Late Payment Interest Rate (%):"),
        
        createSectionTitle("ARTICLE 5: NOTIFICATION AND DOCUMENTATION"),
        new Paragraph({
          text: "5.1 Parties shall notify all Protected Parties in writing of any Transaction involving their introduced parties.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "5.2 Commission statements must be provided within 5 banking days of each payment.",
          spacing: { after: 150 },
        }),
        createBlankLine("5.3 Record Retention Period (years):"),
        
        createSectionTitle("ARTICLE 6: PROTECTION OF COMMERCIAL INTERESTS"),
        createBlankLine("6.1 Exclusive Rights Period (years):"),
        new Paragraph({
          text: "6.2 A Party introducing any third party shall promptly notify all other Parties in writing.",
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "6.3 All introduced parties must acknowledge the Protected Party's right to receive commissions.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 7: BREACH AND REMEDIES"),
        new Paragraph({
          text: "7.1 Breach occurs when any Party circumvents a Protected Party or fails to pay commissions.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "7.2 Liquidated Damages: In the event of circumvention, the breaching Party shall pay:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• All unpaid commissions",
          spacing: { after: 100 },
        }),
        createBlankLine("• Liquidated damages (multiple of commission):"),
        new Paragraph({
          text: "• All legal costs and expenses",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "7.3 Protected Parties are entitled to seek immediate injunctive relief.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 8: CONFIDENTIALITY"),
        createBlankLine("Confidentiality Period (years):"),
        
        createSectionTitle("ARTICLE 9: DISPUTE RESOLUTION"),
        createBlankLine("9.1 Negotiation Period (days):"),
        createBlankLine("9.2 Arbitration Rules:"),
        createBlankLine("9.3 Governing Law (Jurisdiction):"),
        
        createSectionTitle("ARTICLE 10: GENERAL PROVISIONS"),
        new Paragraph({
          text: "• This Agreement constitutes the entire agreement between the Parties",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Amendments require written agreement signed by both Parties",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Assignment requires prior written consent",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• All notices must be in writing",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("SELLER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL]",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("BUYER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL]",
          spacing: { after: 100 },
        }),
      ],
    }],
  });
}

function generateBOLDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "BILL OF LADING",
          "(BOL) - Transport Document and Receipt of Goods"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "B/L NUMBER: ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 200 },
        }),
        
        createSectionTitle("SHIPPER (Consignor)"),
        createBlankLine("Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Tax ID:"),
        
        createSectionTitle("CONSIGNEE"),
        createBlankLine("Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Tax ID:"),
        
        createSectionTitle("NOTIFY PARTY"),
        createBlankLine("Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Phone/Email:"),
        
        createSectionTitle("VESSEL AND VOYAGE"),
        createBlankLine("Vessel Name:"),
        createBlankLine("Voyage Number:"),
        createBlankLine("Flag:"),
        createBlankLine("IMO Number:"),
        
        createSectionTitle("PORT INFORMATION"),
        createBlankLine("Port of Loading:"),
        createBlankLine("Port of Discharge:"),
        createBlankLine("Place of Receipt:"),
        createBlankLine("Place of Delivery:"),
        
        createSectionTitle("CARGO DETAILS"),
        createBlankLine("Marks and Numbers:"),
        createBlankLine("Number and Kind of Packages:"),
        createBlankLine("Description of Goods:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Gross Weight (kg):"),
        createBlankLine("Measurement (m³):"),
        createBlankLine("Container Numbers:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("FREIGHT AND CHARGES"),
        new Paragraph({
          text: "☐ FREIGHT PREPAID",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ FREIGHT COLLECT",
          spacing: { after: 100 },
        }),
        createBlankLine("Freight Amount:"),
        createBlankLine("Place of Payment:"),
        
        createSectionTitle("TERMS AND CONDITIONS"),
        new Paragraph({
          text: "Number of Original B/Ls: ☐ 3  ☐ Other: _______",
          spacing: { after: 100 },
        }),
        createBlankLine("Date of Issue:"),
        createBlankLine("Place of Issue:"),
        new Paragraph({
          text: "☐ Clean On Board",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Received for Shipment",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Shipped on board: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IMPORTANT: This is a negotiable document and title to the goods. All terms and conditions of the carrier's standard Bill of Lading apply.",
              italics: true,
              size: 20,
            }),
          ],
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("CARRIER SIGNATURE"),
        new Paragraph({
          text: "For and on behalf of the Carrier:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[CARRIER STAMP/SEAL]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateCOODocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "CERTIFICATE OF ORIGIN",
          "(COO) - Certification of Country of Origin"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Certificate Number: ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 200 },
        }),
        
        createSectionTitle("EXPORTER/PRODUCER"),
        createBlankLine("Company Name:"),
        createBlankLine("Business Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Country:"),
        createBlankLine("Phone:"),
        createBlankLine("Email:"),
        
        createSectionTitle("CONSIGNEE/BUYER"),
        createBlankLine("Company Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Country:"),
        
        createSectionTitle("TRANSPORT DETAILS"),
        createBlankLine("Means of Transport:"),
        createBlankLine("Vessel/Flight/Vehicle:"),
        createBlankLine("Port of Loading:"),
        createBlankLine("Port of Discharge:"),
        createBlankLine("Final Destination:"),
        
        createSectionTitle("GOODS DESCRIPTION"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Marks, Numbers, and Packages:",
              bold: true,
              size: 22,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Number and Type of Packages:",
              bold: true,
              size: 22,
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Quantity:"),
        createBlankLine("Package Type:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Description of Goods:",
              bold: true,
              size: 22,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 200 },
        }),
        
        createBlankLine("HS Code:"),
        createBlankLine("Gross Weight:"),
        createBlankLine("Net Weight:"),
        createBlankLine("Invoice Number:"),
        createBlankLine("Invoice Date:"),
        
        createSectionTitle("ORIGIN DECLARATION"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Country of Origin: ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          text: "☐ The goods described above originate from the country stated",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Goods wholly obtained/produced in the country of origin",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Goods substantially transformed in the country of origin",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Percentage of Local Content: ",
              bold: true,
            }),
            new TextRun({
              text: "_____________ %",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        createSectionTitle("CERTIFICATION"),
        new Paragraph({
          text: "The undersigned hereby certifies that the above details and statements are correct; that all goods were produced/manufactured in:",
          spacing: { after: 100 },
        }),
        createBlankLine("Country of Origin:"),
        new Paragraph({
          text: "and that they comply with the origin requirements specified for the goods in the applicable preferential trade agreements or rules of origin.",
          spacing: { before: 100, after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Issued by (Chamber of Commerce/Trade Authority):",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Authority Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        
        createSectionTitle("EXPORTER DECLARATION"),
        new Paragraph({
          text: "I/We declare that the information provided is true and correct:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        
        createSectionTitle("CERTIFICATION AUTHORITY"),
        new Paragraph({
          text: "Certified by the undersigned authority:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Officer Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date of Issue:"),
        createBlankLine("Place of Issue:"),
        new Paragraph({
          text: "[OFFICIAL STAMP/SEAL]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateFCODocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "FULL CORPORATE OFFER",
          "(FCO) - Binding Commercial Offer"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "FROM (Seller): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "TO (Buyer): ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "Dear Sir/Madam,",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "We, the undersigned, acting as Seller, hereby issue this Full Corporate Offer (FCO) with full corporate authority and responsibility, confirming our readiness to supply the following commodity under the terms and conditions herein specified:",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 1: COMMODITY SPECIFICATION"),
        createBlankLine("1.1 Product Name:"),
        createBlankLine("1.2 Commodity Description:"),
        createBlankLine("1.3 Total Quantity:"),
        createBlankLine("1.4 Unit of Measurement:"),
        createBlankLine("1.5 Country of Origin:"),
        createBlankLine("1.6 Quality Standard:"),
        createBlankLine("1.7 Packing:"),
        createBlankLine("1.8 HS Code:"),
        
        createSectionTitle("ARTICLE 2: PRICING"),
        createBlankLine("2.1 Unit Price (USD):"),
        createBlankLine("2.2 Total Contract Value (USD):"),
        createBlankLine("2.3 Currency:"),
        createBlankLine("2.4 Price Basis:"),
        createBlankLine("2.5 Price Validity Period:"),
        
        createSectionTitle("ARTICLE 3: DELIVERY TERMS"),
        createBlankLine("3.1 INCOTERM 2020:"),
        createBlankLine("3.2 Shipment Period:"),
        createBlankLine("3.3 Loading Port:"),
        createBlankLine("3.4 Destination Port:"),
        createBlankLine("3.5 Partial Shipments:"),
        createBlankLine("3.6 Transshipment:"),
        createBlankLine("3.7 Delivery Schedule:"),
        
        createSectionTitle("ARTICLE 4: PAYMENT TERMS"),
        createBlankLine("4.1 Payment Instrument:"),
        createBlankLine("4.2 Payment Terms:"),
        createBlankLine("4.3 Issuing Bank:"),
        createBlankLine("4.4 Advising/Confirming Bank:"),
        createBlankLine("4.5 Letter of Credit Type:"),
        createBlankLine("4.6 LC Opening Timeline:"),
        
        createSectionTitle("ARTICLE 5: INSPECTION AND QUALITY CONTROL"),
        createBlankLine("5.1 Pre-shipment Inspector:"),
        createBlankLine("5.2 Quality Certificate:"),
        createBlankLine("5.3 Quantity Certificate:"),
        createBlankLine("5.4 Inspection Location:"),
        createBlankLine("5.5 Inspection Costs:"),
        createBlankLine("5.6 Acceptance Criteria:"),
        
        createSectionTitle("ARTICLE 6: REQUIRED DOCUMENTS"),
        new Paragraph({
          text: "☐ Commercial Invoice (3 originals + 3 copies)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Full Set Clean On Board Bill of Lading",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Origin (Form A)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quality",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Quantity",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Packing List",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Insurance Policy/Certificate (if applicable)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Fumigation Certificate (if required)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Other: _____________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 7: VALIDITY AND BINDING NATURE"),
        createBlankLine("7.1 This FCO is valid for:"),
        new Paragraph({
          children: [
            new TextRun({
              text: "7.2 This is a BINDING OFFER and constitutes a firm commitment from the Seller to supply the goods upon acceptance by Buyer.",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("ARTICLE 8: PERFORMANCE BOND"),
        createBlankLine("8.1 Performance Bond Required:"),
        createBlankLine("8.2 Performance Bond Amount:"),
        createBlankLine("8.3 Issuing Bank:"),
        
        createSectionTitle("ARTICLE 9: INSURANCE"),
        createBlankLine("9.1 Insurance Coverage:"),
        createBlankLine("9.2 Insured By:"),
        createBlankLine("9.3 Insurance Value:"),
        
        createSectionTitle("ARTICLE 10: FORCE MAJEURE"),
        new Paragraph({
          text: "Neither party shall be liable for failure to perform if such failure results from causes beyond reasonable control including but not limited to: acts of God, war, terrorism, strikes, government actions, pandemics, or natural disasters.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 11: GOVERNING LAW AND ARBITRATION"),
        createBlankLine("11.1 Governing Law:"),
        createBlankLine("11.2 Arbitration Rules:"),
        createBlankLine("11.3 Arbitration Seat:"),
        
        new Paragraph({
          text: "Yours faithfully,",
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("SELLER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Company:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY SEAL/STAMP]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateRWADocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "READY, WILLING AND ABLE LETTER",
          "(RWA) - Bank Confirmation of Financial Capability"
        ),
        
        new Paragraph({
          text: "TO WHOM IT MAY CONCERN",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "RE: CONFIRMATION OF READY, WILLING AND ABLE FOR ",
              bold: true,
            }),
            new TextRun({
              text: "______________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        createSectionTitle("CLIENT INFORMATION"),
        createBlankLine("Company Name:"),
        createBlankLine("Account Number:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("BANK INFORMATION"),
        createBlankLine("Bank Name:"),
        createBlankLine("Bank Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("SWIFT/BIC Code:"),
        createBlankLine("Bank License Number:"),
        
        createSectionTitle("TRANSACTION DETAILS"),
        createBlankLine("Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Estimated Transaction Value (USD):"),
        createBlankLine("Seller/Beneficiary:"),
        
        createSectionTitle("BANK CONFIRMATION"),
        new Paragraph({
          children: [
            new TextRun({
              text: "We, the undersigned financial institution, hereby certify and confirm that:",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "1. The above-named client is our valued customer and maintains an active account in good standing.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "2. Our client is READY, WILLING, and ABLE to engage in the above-referenced transaction.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "3. Our client has sufficient funds and/or approved credit facilities to complete this transaction.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "4. The funds are unencumbered, of non-criminal origin, and free from any legal restrictions.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "5. We are prepared to issue a Letter of Credit or effect payment via bank-to-bank transfer upon presentation of proper documentation.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("VALIDITY"),
        createBlankLine("Valid From:"),
        createBlankLine("Valid Until:"),
        
        new Paragraph({
          text: "Yours faithfully,",
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("BANK OFFICER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Department:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[BANK OFFICIAL STAMP/SEAL]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 300 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateBCLDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "BANK COMFORT LETTER",
          "(BCL) - Bank Financial Support Confirmation"
        ),
        
        new Paragraph({
          text: "TO WHOM IT MAY CONCERN",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "RE: BANK COMFORT LETTER FOR ",
              bold: true,
            }),
            new TextRun({
              text: "______________________________",
            }),
          ],
          spacing: { after: 300 },
        }),
        
        createSectionTitle("CLIENT DETAILS"),
        createBlankLine("Company Name:"),
        createBlankLine("Account Number:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Registered Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("BANK DETAILS"),
        createBlankLine("Bank Name:"),
        createBlankLine("Bank Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("SWIFT Code:"),
        createBlankLine("Regulatory License:"),
        
        createSectionTitle("TRANSACTION INFORMATION"),
        createBlankLine("Transaction Purpose:"),
        createBlankLine("Commodity/Service:"),
        createBlankLine("Estimated Value (USD):"),
        createBlankLine("Counterparty:"),
        
        createSectionTitle("BANK COMFORT STATEMENT"),
        new Paragraph({
          text: "We, the undersigned bank, provide this Comfort Letter regarding our client referenced above:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "1. The above-named company is our valued customer and maintains a business relationship with our institution.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "2. Our client maintains accounts with our bank in good standing.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "3. To the best of our knowledge, our client is financially sound and capable of conducting business transactions.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "4. Our bank maintains a satisfactory banking relationship with the client.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "5. We would view favorably a request from our client to facilitate the referenced transaction, subject to our normal credit approval process.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("IMPORTANT DISCLAIMER"),
        new Paragraph({
          children: [
            new TextRun({
              text: "This letter is issued as a matter of goodwill and does not constitute:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• A guarantee of payment or performance",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• A commitment to provide financing",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• A legally binding obligation on the part of the bank",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• An indication of specific account balances or credit limits",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("VALIDITY"),
        createBlankLine("This letter is valid for:"),
        createBlankLine("Issue Date:"),
        createBlankLine("Expiry Date:"),
        
        new Paragraph({
          text: "Yours faithfully,",
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("BANK OFFICER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[BANK OFFICIAL STAMP]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generateTSADocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "TRANSACTION SUPPORT AGREEMENT",
          "(TSA) - Transaction Facilitation Agreement"
        ),
        
        new Paragraph({
          text: "This Transaction Support Agreement is entered into on:",
          spacing: { after: 100 },
        }),
        createBlankLine("Date:"),
        
        createSectionTitle("PARTIES"),
        new Paragraph({
          children: [
            new TextRun({
              text: "PARTY A (Principal):",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "PARTY B (Support Provider):",
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 1: PURPOSE"),
        new Paragraph({
          text: "This Agreement establishes the terms under which Party B will provide transaction support services to Party A for:",
          spacing: { after: 100 },
        }),
        createBlankLine("Transaction Description:"),
        createBlankLine("Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Estimated Value:"),
        
        createSectionTitle("ARTICLE 2: SCOPE OF SERVICES"),
        new Paragraph({
          text: "Party B agrees to provide the following support services:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Document preparation and verification",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Quality assurance and inspection coordination",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Logistics and shipping coordination",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Banking and payment facilitation",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Customs clearance support",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Other: _____________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 3: RESPONSIBILITIES"),
        new Paragraph({
          children: [
            new TextRun({
              text: "3.1 Party A Responsibilities:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Provide all necessary documentation and information",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Pay agreed fees on time",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Cooperate with Party B in service delivery",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "3.2 Party B Responsibilities:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Execute services professionally and timely",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Maintain confidentiality",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Provide regular status updates",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 4: FEES AND PAYMENT"),
        createBlankLine("4.1 Service Fee:"),
        createBlankLine("4.2 Payment Terms:"),
        createBlankLine("4.3 Payment Method:"),
        createBlankLine("4.4 Additional Costs:"),
        
        createSectionTitle("ARTICLE 5: TERM AND TERMINATION"),
        createBlankLine("5.1 Initial Term:"),
        createBlankLine("5.2 Notice Period for Termination:"),
        
        createSectionTitle("ARTICLE 6: CONFIDENTIALITY"),
        new Paragraph({
          text: "Both parties agree to maintain confidentiality of all transaction-related information.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 7: LIABILITY AND INDEMNIFICATION"),
        createBlankLine("7.1 Liability Cap:"),
        new Paragraph({
          text: "7.2 Each party shall indemnify the other against losses arising from breach of this Agreement.",
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("ARTICLE 8: GOVERNING LAW"),
        createBlankLine("Governing Jurisdiction:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IN WITNESS WHEREOF, the parties have executed this Agreement.",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("PARTY A SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        
        createSectionTitle("PARTY B SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
      ],
    }],
  });
}

function generateSPADocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "SALES AND PURCHASE AGREEMENT",
          "(SPA) - Binding Sales Contract"
        ),
        
        new Paragraph({
          text: "This Sales and Purchase Agreement is entered into on:",
          spacing: { after: 100 },
        }),
        createBlankLine("Date:"),
        
        createSectionTitle("SELLER"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Represented by:"),
        
        createSectionTitle("BUYER"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Represented by:"),
        
        createSectionTitle("ARTICLE 1: COMMODITY"),
        createBlankLine("1.1 Product Description:"),
        createBlankLine("1.2 Total Quantity:"),
        createBlankLine("1.3 Unit of Measurement:"),
        createBlankLine("1.4 Quality Specification:"),
        createBlankLine("1.5 Country of Origin:"),
        createBlankLine("1.6 Packing:"),
        createBlankLine("1.7 HS Code:"),
        
        createSectionTitle("ARTICLE 2: PRICE AND PAYMENT"),
        createBlankLine("2.1 Unit Price (USD):"),
        createBlankLine("2.2 Total Contract Value (USD):"),
        createBlankLine("2.3 Currency:"),
        createBlankLine("2.4 Payment Terms:"),
        createBlankLine("2.5 Payment Method:"),
        createBlankLine("2.6 Down Payment (if any):"),
        
        createSectionTitle("ARTICLE 3: DELIVERY"),
        createBlankLine("3.1 INCOTERM 2020:"),
        createBlankLine("3.2 Loading Port:"),
        createBlankLine("3.3 Destination Port:"),
        createBlankLine("3.4 Delivery Period:"),
        createBlankLine("3.5 Partial Shipments:"),
        createBlankLine("3.6 Transshipment:"),
        
        createSectionTitle("ARTICLE 4: INSPECTION AND QUALITY"),
        createBlankLine("4.1 Inspector:"),
        createBlankLine("4.2 Inspection Location:"),
        createBlankLine("4.3 Quality Standards:"),
        createBlankLine("4.4 Rejection Criteria:"),
        createBlankLine("4.5 Inspection Costs:"),
        
        createSectionTitle("ARTICLE 5: INSURANCE"),
        createBlankLine("5.1 Insured by:"),
        createBlankLine("5.2 Coverage:"),
        createBlankLine("5.3 Insurance Value:"),
        
        createSectionTitle("ARTICLE 6: DOCUMENTS"),
        new Paragraph({
          text: "Seller shall provide:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Commercial Invoice",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Bill of Lading",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Certificate of Origin",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Quality Certificate",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Quantity Certificate",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Packing List",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 7: WARRANTIES"),
        new Paragraph({
          text: "7.1 Seller warrants that goods conform to specifications",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "7.2 Seller warrants clear title to goods",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "7.3 Seller warrants compliance with all laws",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 8: FORCE MAJEURE"),
        new Paragraph({
          text: "Neither party liable for delays caused by events beyond reasonable control.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 9: DISPUTE RESOLUTION"),
        createBlankLine("9.1 Governing Law:"),
        createBlankLine("9.2 Arbitration:"),
        createBlankLine("9.3 Arbitration Seat:"),
        
        createSectionTitle("ARTICLE 10: GENERAL PROVISIONS"),
        new Paragraph({
          text: "10.1 This Agreement constitutes the entire agreement",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "10.2 Amendments must be in writing",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "10.3 No assignment without consent",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IN WITNESS WHEREOF, the parties have executed this Agreement.",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("SELLER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[SEAL]",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("BUYER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[SEAL]",
        }),
      ],
    }],
  });
}

function generateASWPDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "ASSIGNMENT OF SALE WITH PRODUCT",
          "(ASWP) - Product Assignment Agreement"
        ),
        
        new Paragraph({
          text: "This Assignment Agreement is entered into on:",
          spacing: { after: 100 },
        }),
        createBlankLine("Date:"),
        
        createSectionTitle("ASSIGNOR (Original Seller)"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("ASSIGNEE (New Seller)"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("BUYER"),
        createBlankLine("Company Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("RECITALS"),
        new Paragraph({
          text: "WHEREAS, the Assignor has entered into a contract with the Buyer for the sale of:",
          spacing: { after: 100 },
        }),
        createBlankLine("Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Contract Reference:"),
        createBlankLine("Contract Date:"),
        new Paragraph({
          text: "WHEREAS, the Assignor wishes to assign all rights and obligations under the said contract to the Assignee;",
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "WHEREAS, the Assignee accepts such assignment;",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "NOW THEREFORE, the parties agree as follows:",
              bold: true,
            }),
          ],
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 1: ASSIGNMENT"),
        new Paragraph({
          text: "1.1 The Assignor hereby assigns, transfers, and conveys to the Assignee all of Assignor's rights, title, interest, and obligations in the Contract.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "1.2 The Assignee accepts the assignment and assumes all obligations of the Assignor under the Contract.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 2: PRODUCT DETAILS"),
        createBlankLine("Product Description:"),
        createBlankLine("Total Quantity:"),
        createBlankLine("Unit Price:"),
        createBlankLine("Total Contract Value:"),
        createBlankLine("Delivery Terms:"),
        createBlankLine("Delivery Date:"),
        
        createSectionTitle("ARTICLE 3: CONSIDERATION"),
        createBlankLine("Assignment Fee:"),
        createBlankLine("Payment Terms for Assignment:"),
        createBlankLine("Payment Method:"),
        
        createSectionTitle("ARTICLE 4: REPRESENTATIONS AND WARRANTIES"),
        new Paragraph({
          text: "4.1 Assignor represents that:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• The Contract is valid and enforceable",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Assignor has full authority to assign the Contract",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• No breach of Contract exists",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• All required consents have been obtained",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 5: ASSIGNEE OBLIGATIONS"),
        new Paragraph({
          text: "5.1 The Assignee agrees to:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Perform all obligations under the Contract",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Deliver goods per Contract terms",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Indemnify Assignor for any breach",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 6: BUYER CONSENT"),
        new Paragraph({
          text: "The Buyer hereby acknowledges and consents to this assignment.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("ARTICLE 7: EFFECTIVE DATE"),
        createBlankLine("This Assignment becomes effective on:"),
        
        createSectionTitle("ARTICLE 8: GOVERNING LAW"),
        createBlankLine("Governing Jurisdiction:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "IN WITNESS WHEREOF, the parties have executed this Assignment.",
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("ASSIGNOR SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        
        createSectionTitle("ASSIGNEE SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        
        createSectionTitle("BUYER CONSENT AND SIGNATURE"),
        new Paragraph({
          text: "The Buyer consents to this assignment:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
      ],
    }],
  });
}

function generateQualityCertDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "QUALITY CERTIFICATE",
          "Product Quality Verification Certificate"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Certificate Number: ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 200 },
        }),
        
        createSectionTitle("INSPECTION COMPANY"),
        createBlankLine("Company Name:"),
        createBlankLine("License/Accreditation Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Phone:"),
        createBlankLine("Email:"),
        createBlankLine("Website:"),
        
        createSectionTitle("SHIPPER/SELLER"),
        createBlankLine("Company Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Contact Person:"),
        
        createSectionTitle("CONSIGNEE/BUYER"),
        createBlankLine("Company Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("PRODUCT INFORMATION"),
        createBlankLine("Product Name/Description:"),
        createBlankLine("HS Code:"),
        createBlankLine("Country of Origin:"),
        createBlankLine("Manufacturer:"),
        createBlankLine("Brand Name:"),
        createBlankLine("Batch/Lot Number:"),
        createBlankLine("Manufacturing Date:"),
        createBlankLine("Expiry Date:"),
        
        createSectionTitle("SHIPMENT DETAILS"),
        createBlankLine("Contract/Purchase Order Number:"),
        createBlankLine("Invoice Number:"),
        createBlankLine("Bill of Lading Number:"),
        createBlankLine("Container Numbers:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Number of Packages:"),
        createBlankLine("Gross Weight:"),
        createBlankLine("Net Weight:"),
        createBlankLine("Loading Port:"),
        createBlankLine("Destination Port:"),
        
        createSectionTitle("INSPECTION DETAILS"),
        createBlankLine("Inspection Location:"),
        createBlankLine("Inspection Date:"),
        createBlankLine("Inspection Method/Standard:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("Inspector Name:"),
        createBlankLine("Inspector License Number:"),
        
        createSectionTitle("QUALITY SPECIFICATIONS & TEST RESULTS"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Parameter 1: ",
              bold: true,
            }),
          ],
          spacing: { after: 50 },
        }),
        createBlankLine("Specification: _______________  Actual Result: _______________  ☐ Pass  ☐ Fail"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Parameter 2: ",
              bold: true,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
        createBlankLine("Specification: _______________  Actual Result: _______________  ☐ Pass  ☐ Fail"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Parameter 3: ",
              bold: true,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
        createBlankLine("Specification: _______________  Actual Result: _______________  ☐ Pass  ☐ Fail"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Parameter 4: ",
              bold: true,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
        createBlankLine("Specification: _______________  Actual Result: _______________  ☐ Pass  ☐ Fail"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Parameter 5: ",
              bold: true,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
        createBlankLine("Specification: _______________  Actual Result: _______________  ☐ Pass  ☐ Fail"),
        
        new Paragraph({
          text: "Additional Parameters:",
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("OVERALL QUALITY ASSESSMENT"),
        new Paragraph({
          text: "☐ PASSED - Product meets all quality specifications",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ PASSED WITH REMARKS - See notes below",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ FAILED - Product does not meet specifications",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Remarks/Comments:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("COMPLIANCE STANDARDS"),
        new Paragraph({
          text: "This inspection was conducted in accordance with:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ ISO Standards: _____________________________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ ASTM Standards: _____________________________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Contract Specifications",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "☐ Other: _____________________________________",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("CERTIFICATION"),
        new Paragraph({
          text: "We hereby certify that the above information is true and accurate based on our inspection and testing. The product has been inspected and tested in accordance with the specified standards and contract requirements.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("VALIDITY"),
        createBlankLine("Issue Date:"),
        createBlankLine("Valid Until:"),
        
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        
        createSectionTitle("INSPECTOR SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Inspector Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Inspector Name:"),
        createBlankLine("Inspector ID/License:"),
        createBlankLine("Date:"),
        
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        
        createSectionTitle("AUTHORIZED OFFICER SIGNATURE"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Officer Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[COMPANY OFFICIAL STAMP/SEAL]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

function generatePOPDocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "2% PERFORMANCE BOND",
          "(2% POP) - Performance Guarantee"
        ),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "Bond Number: ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________________________",
            }),
          ],
          spacing: { after: 200 },
        }),
        
        createSectionTitle("ISSUING BANK/GUARANTOR"),
        createBlankLine("Bank Name:"),
        createBlankLine("Bank Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        createBlankLine("SWIFT Code:"),
        createBlankLine("License Number:"),
        
        createSectionTitle("PRINCIPAL (Seller/Contractor)"),
        createBlankLine("Company Name:"),
        createBlankLine("Registration Number:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("BENEFICIARY (Buyer)"),
        createBlankLine("Company Name:"),
        createBlankLine("Address:"),
        new Paragraph({
          text: "_____________________________________________",
          spacing: { after: 100 },
        }),
        
        createSectionTitle("CONTRACT DETAILS"),
        createBlankLine("Contract Reference:"),
        createBlankLine("Contract Date:"),
        createBlankLine("Commodity:"),
        createBlankLine("Quantity:"),
        createBlankLine("Total Contract Value (USD):"),
        
        createSectionTitle("BOND DETAILS"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Bond Amount (2% of Contract Value): USD ",
              bold: true,
            }),
            new TextRun({
              text: "___________________________",
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Bond Currency:"),
        createBlankLine("Effective Date:"),
        createBlankLine("Expiry Date:"),
        
        createSectionTitle("GUARANTEE TERMS"),
        new Paragraph({
          children: [
            new TextRun({
              text: "We, the undersigned bank/guarantor, hereby irrevocably and unconditionally guarantee payment to the Beneficiary of an amount not exceeding 2% of the Contract Value in the event that:",
              bold: true,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "1. The Principal fails to perform any obligations under the Contract;",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "2. The Principal breaches any material terms of the Contract;",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "3. The Principal fails to deliver goods according to specifications;",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "4. The Principal fails to meet delivery deadlines without valid cause;",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "5. The Principal is in default under the Contract.",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("CLAIM PROCEDURE"),
        new Paragraph({
          text: "To make a claim under this Bond, the Beneficiary must:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "1. Submit a written claim to the issuing bank",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "2. Provide evidence of Principal's default",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "3. Submit claim before expiry date",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "4. Include signed statement of default",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("PAYMENT TERMS"),
        new Paragraph({
          text: "Upon receipt of a valid claim, we undertake to pay the Beneficiary within:",
          spacing: { after: 100 },
        }),
        createBlankLine("Payment Timeline (banking days):"),
        new Paragraph({
          text: "Payment will be made without reference to the Principal and regardless of any dispute between the Principal and Beneficiary.",
          spacing: { before: 200, after: 300 },
        }),
        
        createSectionTitle("BOND REDUCTION/RELEASE"),
        new Paragraph({
          text: "This Bond may be reduced or released upon:",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Partial delivery acceptance (proportional reduction)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Full contract performance",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Written release by Beneficiary",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Expiry of Bond period",
          spacing: { after: 300 },
        }),
        
        createSectionTitle("GOVERNING LAW"),
        createBlankLine("Governing Jurisdiction:"),
        createBlankLine("Dispute Resolution:"),
        
        new Paragraph({
          children: [
            new TextRun({
              text: "This Bond is irrevocable and remains in full force until expiry or written release.",
              bold: true,
            }),
          ],
          spacing: { before: 300, after: 300 },
        }),
        
        createSectionTitle("BANK/GUARANTOR SIGNATURE"),
        new Paragraph({
          text: "For and on behalf of the Bank/Guarantor:",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Authorized Signature: ",
              bold: true,
            }),
            new TextRun({
              text: "_______________________________",
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 200 },
        }),
        createBlankLine("Name:"),
        createBlankLine("Title:"),
        createBlankLine("Date:"),
        new Paragraph({
          text: "[BANK OFFICIAL STAMP/SEAL]",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
          },
        }),
      ],
    }],
  });
}

export async function generateBlankDocx(documentType: DocumentType): Promise<Blob> {
  let doc: Document;
  
  switch (documentType) {
    case 'CIS':
      doc = generateCISDocument();
      break;
    case 'SCO':
      doc = generateSCODocument();
      break;
    case 'FCO':
      doc = generateFCODocument();
      break;
    case 'ICPO':
      doc = generateICPODocument();
      break;
    case 'LOI':
      doc = generateLOIDocument();
      break;
    case 'POF':
      doc = generatePOFDocument();
      break;
    case 'RWA':
      doc = generateRWADocument();
      break;
    case 'BCL':
      doc = generateBCLDocument();
      break;
    case 'NCNDA':
      doc = generateNCNDADocument();
      break;
    case 'IMFPA':
      doc = generateIMFPADocument();
      break;
    case 'TSA':
      doc = generateTSADocument();
      break;
    case 'SPA':
      doc = generateSPADocument();
      break;
    case 'ASWP':
      doc = generateASWPDocument();
      break;
    case 'POP':
      doc = generatePOPDocument();
      break;
    case 'BOL':
      doc = generateBOLDocument();
      break;
    case 'COO':
      doc = generateCOODocument();
      break;
    case 'QUALITY_CERT':
      doc = generateQualityCertDocument();
      break;
    default:
      throw new Error(`Unknown document type: ${documentType}`);
  }
  
  const blob = await Packer.toBlob(doc);
  return blob;
}

export function downloadDocx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
