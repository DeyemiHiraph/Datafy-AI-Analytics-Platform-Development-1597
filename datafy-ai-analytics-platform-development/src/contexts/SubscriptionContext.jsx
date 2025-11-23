import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getSubscriptionStatus, PRICING_PLANS } from '../services/stripe';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({
    aiQueries: { used: 0, limit: 10 },
    dataSources: { used: 0, limit: 3 },
    storage: { used: 0, limit: 1024 },
    reports: { used: 0, limit: 5 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      const subscriptionData = await getSubscriptionStatus(user.id);
      setSubscription(subscriptionData);
      
      // Load usage data
      const usageData = await fetchUsageData();
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      // Set default subscription for demo
      setSubscription({
        plan: 'starter',
        status: 'active',
        customerId: null
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    try {
      // Mock usage data - replace with real API call
      return {
        aiQueries: { used: 45, limit: getCurrentPlan()?.limits?.aiQueries || 10 },
        dataSources: { used: 3, limit: getCurrentPlan()?.limits?.dataSources || 3 },
        storage: { used: 2048, limit: getCurrentPlan()?.limits?.storage || 1024 },
        reports: { used: 12, limit: getCurrentPlan()?.limits?.reports || 5 }
      };
    } catch (error) {
      console.error('Error fetching usage data:', error);
      return usage;
    }
  };

  const getCurrentPlan = () => {
    return PRICING_PLANS[subscription?.plan || 'starter'];
  };

  const hasFeatureAccess = (feature) => {
    const plan = getCurrentPlan();
    if (!plan) return false;

    const featureMap = {
      'ai_editors': ['business', 'enterprise'],
      'voice_queries': ['business', 'enterprise'],
      'integrations': ['business', 'enterprise'],
      'api_access': ['enterprise'],
      'white_label': ['enterprise'],
      'advanced_analytics': ['business', 'enterprise']
    };

    return featureMap[feature]?.includes(subscription?.plan || 'starter') || false;
  };

  const canUseFeature = (featureType, amount = 1) => {
    const plan = getCurrentPlan();
    if (!plan) return false;

    const currentUsage = usage[featureType];
    if (!currentUsage) return true;

    // Unlimited usage
    if (currentUsage.limit === -1) return true;

    // Check if under limit
    return (currentUsage.used + amount) <= currentUsage.limit;
  };

  const incrementUsage = async (featureType, amount = 1) => {
    const currentUsage = usage[featureType];
    if (!currentUsage || currentUsage.limit === -1) return true;

    if (!canUseFeature(featureType, amount)) {
      throw new Error(`${featureType} limit exceeded. Please upgrade your plan.`);
    }

    setUsage(prev => ({
      ...prev,
      [featureType]: {
        ...prev[featureType],
        used: prev[featureType].used + amount
      }
    }));

    return true;
  };

  const value = {
    subscription,
    usage,
    loading,
    getCurrentPlan,
    hasFeatureAccess,
    canUseFeature,
    incrementUsage,
    refreshSubscription: loadSubscriptionData
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};