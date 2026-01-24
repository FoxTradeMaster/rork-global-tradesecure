// api/generate-companies.js
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
    // Get OpenAI API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    
    console.log('=== DEBUG INFO ===');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    console.log('API Key starts with:', apiKey ? apiKey.substring(0, 7) : 'N/A');
    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('OPENAI')));
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key is required',
        debug: {
          hasKey: !!apiKey,
          envVars: Object.keys(process.env).filter(k => k.includes('OPENAI'))
        }
      });
    }

    // Get request parameters
    const { commodity, count = 5 } = req.body;

    if (!commodity) {
      return res.status(400).json({ error: 'Commodity is required' });
    }

    // Import OpenAI
    const { default: OpenAI } = await import('openai');
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('Generating companies for:', commodity);

    // Generate companies using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates realistic company data for a global trade directory. Generate diverse, realistic company names and descriptions.'
        },
        {
          role: 'user',
          content: `Generate <LaTex>${count} realistic companies that deal with $</LaTex>{commodity}. For each company, provide:
1. Company name (realistic and diverse, from different countries)
2. Short description (1-2 sentences)
3. Country of operation

Format the response as a JSON array with objects containing: name, description, country, commodity.`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    console.log('OpenAI Response:', responseText);

    // Try to parse the JSON response
    let companies;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, responseText];
      const jsonText = jsonMatch[1] || responseText;
      companies = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: parseError.message,
        rawResponse: responseText
      });
    }

    // Ensure companies is an array
    if (!Array.isArray(companies)) {
      companies = [companies];
    }

    // Add commodity to each company if not present
    companies = companies.map(company => ({
      ...company,
      commodity: company.commodity || commodity
    }));

    console.log('Generated companies:', companies.length);

    return res.status(200).json({
      success: true,
      companies: companies,
      count: companies.length
    });

  } catch (error) {
    console.error('Error generating companies:', error);
    return res.status(500).json({ 
      error: 'Failed to generate companies',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
