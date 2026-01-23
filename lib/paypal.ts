import { Platform } from 'react-native';

const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_BASE_URL = __DEV__ 
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

export interface PayPalSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  interval: 'MONTH' | 'YEAR';
  features: string[];
}

export interface PayPalPaymentResponse {
  id: string;
  status: string;
  payer?: {
    email_address?: string;
    payer_id?: string;
  };
  purchase_units?: {
    amount?: {
      value?: string;
      currency_code?: string;
    };
  }[];
}

export interface PayPalSubscriptionResponse {
  id: string;
  status: string;
  plan_id?: string;
  subscriber?: {
    email_address?: string;
  };
}

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

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: string, currency: string = 'USD', description: string = 'Payment'): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: description,
          },
        ],
        application_context: {
          brand_name: 'Fox Trade Master',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: Platform.OS === 'web' 
            ? `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/success`
            : 'foxtrademaster://payment/success',
          cancel_url: Platform.OS === 'web'
            ? `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/cancel`
            : 'foxtrademaster://payment/cancel',
        },
      }),
    });

    const order = await response.json();
    console.log('[PayPal] Order created:', order.id);
    return order;
  } catch (error) {
    console.error('[PayPal] Error creating order:', error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalPaymentResponse> {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const capture = await response.json();
    console.log('[PayPal] Order captured:', capture);
    return capture;
  } catch (error) {
    console.error('[PayPal] Error capturing order:', error);
    throw error;
  }
}

export async function createPayPalSubscription(planId: string): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'Fox Trade Master',
          user_action: 'SUBSCRIBE_NOW',
          return_url: Platform.OS === 'web'
            ? `${typeof window !== 'undefined' ? window.location.origin : ''}/subscription/success`
            : 'foxtrademaster://subscription/success',
          cancel_url: Platform.OS === 'web'
            ? `${typeof window !== 'undefined' ? window.location.origin : ''}/subscription/cancel`
            : 'foxtrademaster://subscription/cancel',
        },
      }),
    });

    const subscription = await response.json();
    console.log('[PayPal] Subscription created:', subscription.id);
    return subscription;
  } catch (error) {
    console.error('[PayPal] Error creating subscription:', error);
    throw error;
  }
}

export async function getPayPalSubscription(subscriptionId: string): Promise<PayPalSubscriptionResponse> {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const subscription = await response.json();
    return subscription;
  } catch (error) {
    console.error('[PayPal] Error getting subscription:', error);
    throw error;
  }
}

export async function cancelPayPalSubscription(subscriptionId: string, reason: string = 'Customer request'): Promise<void> {
  try {
    const accessToken = await getAccessToken();
    
    await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason: reason,
      }),
    });

    console.log('[PayPal] Subscription cancelled:', subscriptionId);
  } catch (error) {
    console.error('[PayPal] Error cancelling subscription:', error);
    throw error;
  }
}

export const SUBSCRIPTION_PLANS: PayPalSubscriptionPlan[] = [
  {
    id: 'P-3W87840565478320LNFLCXEA',
    name: 'Premium Monthly',
    description: '0.5% platform fee + unlimited features',
    price: '$99/month',
    interval: 'MONTH',
    features: [
      'Create unlimited trades',
      'Add unlimited counterparties',
      'Generate all document types',
      'Add companies to market directory',
      'Advanced analytics & insights',
      'Priority support',
      'Only 0.5% commission rate',
    ],
  },
  {
    id: 'P-9XE03721ER697370SNFLDL7Q',
    name: 'Premium Yearly',
    description: '0.5% platform fee + unlimited features',
    price: '$999/year',
    interval: 'YEAR',
    features: [
      'Create unlimited trades',
      'Add unlimited counterparties',
      'Generate all document types',
      'Add companies to market directory',
      'Advanced analytics & insights',
      'Priority support',
      'Only 0.5% commission rate',
      'Save $189/year (2 months free)',
    ],
  },
];

export function openPayPalCheckout(approvalUrl: string): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.href = approvalUrl;
    }
  } else {
    console.log('[PayPal] Open URL in WebView or InAppBrowser:', approvalUrl);
  }
}
