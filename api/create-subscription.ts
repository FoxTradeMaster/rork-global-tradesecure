import type { VercelRequest, VercelResponse } from '@vercel/node';

const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, returnUrl, cancelUrl } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Create subscription
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'Global TradeSecure',
          user_action: 'SUBSCRIBE_NOW',
          return_url: returnUrl || `${req.headers.origin}/subscription/success`,
          cancel_url: cancelUrl || `${req.headers.origin}/subscription/cancel`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[PayPal API Error]:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to create subscription', 
        details: errorData 
      });
    }

    const subscription = await response.json();
    console.log('[PayPal] Subscription created:', subscription.id);

    return res.status(200).json(subscription);
  } catch (error: any) {
    console.error('[PayPal] Error creating subscription:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
