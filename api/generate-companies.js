// Updated: Jan 24, 2026 export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { commodity, commodityLabel, count } = req.body;

    if (!commodity || !commodityLabel || !count) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const prompt = `List ${count} well-known, REAL companies that operate in the ${commodityLabel} market.

Provide only:
- Exact company name (as it appears publicly)
- Company type (Trading Company, Refinery, Distributor, Mining Company, Producer, etc.)
- Primary region (Asia, Europe, Americas, Middle East, Africa)

These will be looked up in BrandFetch to get verified business data, logos, and contact information.
Only include major, established companies that would have a public brand presence.
Focus on companies that haven't been added yet - try to find diverse companies from different regions.

Respond with valid JSON only: {"companies": [{"name": "...", "type": "...", "region": "..."}]}`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business research assistant. Generate accurate, real company names in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No response from OpenAI' });
    }

    const parsed = JSON.parse(content);
    return res.status(200).json({ companies: parsed.companies || [] });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error'
    });
  }
}
