// api/generate-companies.js
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify required environment variables
    const requiredEnvVars = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      BRANDFETCH_API_KEY: process.env.BRANDFETCH_API_KEY,
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return res.status(500).json({ 
        error: 'Missing required environment variables',
        missing: missingVars
      });
    }

    // Get request parameters
    const { commodity = 'gold', count = 10 } = req.body;

    console.log(`[Autonomous Updater] Starting generation: ${count} ${commodity} companies`);

    // Path to the populate-market script
    const scriptPath = path.join(__dirname, '..', 'scripts', 'populate-market.mjs');

    // Build command with environment variables
    const command = `node "${scriptPath}" --commodity ${commodity} --count ${count}`;

    console.log(`[Autonomous Updater] Executing: ${command}`);

    // Execute the script with a timeout of 5 minutes
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        OPENAI_API_KEY: requiredEnvVars.OPENAI_API_KEY,
        BRANDFETCH_API_KEY: requiredEnvVars.BRANDFETCH_API_KEY,
        EXPO_PUBLIC_SUPABASE_URL: requiredEnvVars.EXPO_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY,
      },
      timeout: 300000, // 5 minutes
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    console.log('[Autonomous Updater] Script output:', stdout);
    if (stderr) {
      console.warn('[Autonomous Updater] Script warnings:', stderr);
    }

    // Parse the output to extract success count
    const successMatch = stdout.match(/Successfully added (\d+)/i);
    const successCount = successMatch ? parseInt(successMatch[1]) : 0;

    return res.status(200).json({
      success: true,
      message: `Successfully generated and saved ${successCount} companies with Brandfetch verification`,
      commodity,
      requested: count,
      added: successCount,
      output: stdout,
    });

  } catch (error) {
    console.error('[Autonomous Updater] Error:', error);
    
    // Check if it's a timeout error
    if (error.killed) {
      return res.status(504).json({ 
        error: 'Request timeout - generation took too long',
        details: 'The company generation process exceeded the 5-minute limit'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to generate companies',
      details: error.message,
      stderr: error.stderr,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
