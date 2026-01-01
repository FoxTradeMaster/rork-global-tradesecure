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

type DocumentType = 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'MFPA';

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

function generateMFPADocument(): Document {
  return new Document({
    sections: [{
      properties: {},
      children: [
        ...createDocumentHeader(
          "MASTER FEE PROTECTION AGREEMENT",
          "(MFPA)"
        ),
        
        new Paragraph({
          text: "This Master Fee Protection Agreement (\"Agreement\") is entered into on:",
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

export async function generateBlankDocx(documentType: DocumentType): Promise<Blob> {
  let doc: Document;
  
  switch (documentType) {
    case 'CIS':
      doc = generateCISDocument();
      break;
    case 'SCO':
      doc = generateSCODocument();
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
    case 'NCNDA':
      doc = generateNCNDADocument();
      break;
    case 'MFPA':
      doc = generateMFPADocument();
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
