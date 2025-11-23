import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const getStripe = () => stripePromise;

export const createCheckoutSession = async (priceId, customerId = null) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Checkout session error:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId) => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/app/settings`
      })
    });

    const session = await response.json();
    
    if (session.url) {
      window.location.href = session.url;
    }
  } catch (error) {
    console.error('Portal session error:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await fetch(`/api/stripe/subscription-status/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Subscription status error:', error);
    return {
      status: 'none',
      plan: 'starter'
    };
  }
};

// Pricing plans configuration
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 0,
    priceId: null,
    features: [
      'Up to 3 data sources',
      '10 AI queries per month',
      'Basic visualizations',
      'Email support',
      '1GB data storage'
    ],
    limits: {
      dataSources: 3,
      aiQueries: 10,
      storage: 1024, // MB
      reports: 5
    }
  },
  business: {
    name: 'Business',
    price: 500,
    priceId: import.meta.env.VITE_STRIPE_BUSINESS_PRICE_ID,
    features: [
      'Unlimited data sources',
      '1000 AI queries per month',
      'Advanced visualizations',
      'Priority support',
      '50GB data storage',
      'AI SQL/Python editors',
      'Voice queries',
      'Slack integration'
    ],
    limits: {
      dataSources: -1, // unlimited
      aiQueries: 1000,
      storage: 51200, // MB
      reports: 50
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 1500,
    priceId: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Everything in Business',
      'Unlimited AI queries',
      'White-label solution',
      'Dedicated support',
      'Unlimited storage',
      'API access',
      'Custom integrations',
      'Advanced security'
    ],
    limits: {
      dataSources: -1,
      aiQueries: -1,
      storage: -1,
      reports: -1
    }
  }
};