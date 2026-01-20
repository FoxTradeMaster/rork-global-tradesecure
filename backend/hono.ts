import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { readFile } from "fs/promises";
import { join } from "path";
import { mdToPdf } from "md-to-pdf";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() });
});

app.get("/health", (c) => {
  return c.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    services: {
      brandfetch: !!process.env.BRANDFETCH_API_KEY,
      supabase: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  });
});

app.get("/user-manual.pdf", async (c) => {
  try {
    const manualPath = join(process.cwd(), "USER_MANUAL.md");
    const markdown = await readFile(manualPath, "utf-8");
    
    const pdf = await mdToPdf(
      { content: markdown },
      {
        pdf_options: {
          format: "A4",
          margin: {
            top: "20mm",
            right: "20mm",
            bottom: "20mm",
            left: "20mm",
          },
          printBackground: true,
        },
        stylesheet: [
          `body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: #1E3A5F;
            font-size: 24pt;
            margin-top: 20pt;
            margin-bottom: 12pt;
            border-bottom: 2px solid #1E3A5F;
            padding-bottom: 8pt;
          }
          h2 {
            color: #1E3A5F;
            font-size: 18pt;
            margin-top: 16pt;
            margin-bottom: 10pt;
            border-bottom: 1px solid #ddd;
            padding-bottom: 6pt;
          }
          h3 {
            color: #2c5282;
            font-size: 14pt;
            margin-top: 14pt;
            margin-bottom: 8pt;
          }
          h4 {
            color: #3182ce;
            font-size: 12pt;
            margin-top: 12pt;
            margin-bottom: 6pt;
          }
          p {
            margin-bottom: 8pt;
          }
          ul, ol {
            margin-left: 20pt;
            margin-bottom: 10pt;
          }
          li {
            margin-bottom: 4pt;
          }
          code {
            background-color: #f5f5f5;
            padding: 2pt 4pt;
            border-radius: 3pt;
            font-family: 'Courier New', Courier, monospace;
            font-size: 9pt;
          }
          pre {
            background-color: #f5f5f5;
            padding: 10pt;
            border-radius: 4pt;
            border-left: 3pt solid #3182ce;
            overflow-x: auto;
            margin-bottom: 10pt;
          }
          blockquote {
            border-left: 3pt solid #3182ce;
            padding-left: 10pt;
            margin-left: 0;
            color: #666;
            font-style: italic;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 12pt;
          }
          th, td {
            border: 1pt solid #ddd;
            padding: 6pt;
            text-align: left;
          }
          th {
            background-color: #1E3A5F;
            color: white;
            font-weight: bold;
          }
          strong {
            font-weight: 700;
            color: #1E3A5F;
          }
          hr {
            border: none;
            border-top: 1pt solid #ddd;
            margin: 16pt 0;
          }
          @page {
            margin: 20mm;
          }`
        ],
      }
    );

    if (!pdf || !pdf.content) {
      throw new Error("Failed to generate PDF");
    }

    const pdfBuffer = pdf.content as Buffer;
    
    return c.newResponse(new Uint8Array(pdfBuffer), 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Fox_Trade_Master_User_Manual.pdf"',
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return c.json(
      { 
        error: "Failed to generate PDF", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      500
    );
  }
});

export default app;
