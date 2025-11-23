import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getSubscriptionStatus, createPortalSession, PRICING_PLANS } from '../../services/stripe';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiCreditCard, FiCalendar, FiTrendingUp, FiSettings, FiAlertCircle } = FiIcons;

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      const [subscriptionData, usageData] = await Promise.all([
        getSubscriptionStatus(user.id),
        fetchUsageData()
      ]);
      
      setSubscription(subscriptionData);
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    try {
      const response = await fetch(`/api/usage/${user.id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching usage data:', error);
      return {
        aiQueries: { used: 45, limit: 1000 },
        dataSources: { used: 3, limit: -1 },
        storage: { used: 2048, limit: 51200 },
        reports: { used: 12, limit: 50 }
      };
    }
  };

  const openBillingPortal = async () => {
    if (!subscription?.customerId) return;
    
    setLoading(true);
    try {
      await createPortalSession(subscription.customerId);
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentPlan = PRICING_PLANS[subscription?.plan || 'starter'];

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-primary-500" />
            <span>Current Subscription</span>
          </h3>
          {subscription?.status === 'active' && (
            <button
              onClick={openBillingPortal}
              disabled={loading}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <SafeIcon icon={FiSettings} className="w-4 h-4" />
              <span>Manage Billing</span>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                subscription?.plan === 'enterprise' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : subscription?.plan === 'business' 
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-400' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <SafeIcon 
                  icon={FiTrendingUp} 
                  className={`w-6 h-6 ${
                    subscription?.plan !== 'starter' ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                  }`} 
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {currentPlan?.name || 'Starter'}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  €{currentPlan?.price || 0}/{currentPlan?.price === 0 ? 'forever' : 'month'}
                </p>
              </div>
            </div>

            {subscription?.status === 'active' && subscription?.currentPeriodEnd && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                </div>
                {subscription?.cancelAtPeriodEnd && (
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                    <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                    <span>Subscription will cancel on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Plan Features */}
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Plan Features</h5>
            <div className="space-y-2">
              {(currentPlan?.features || ['Basic analytics']).slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Usage Statistics */}
      {usage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Usage Statistics
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(usage).map(([key, data]) => {
              const percentage = getUsagePercentage(data.used, data.limit);
              const isUnlimited = data.limit === -1;

              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {data.used.toLocaleString()}{!isUnlimited && ` / ${data.limit.toLocaleString()}`}
                    </span>
                  </div>
                  {!isUnlimited && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                  {isUnlimited && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Unlimited
                    </div>
                  )}
                  {percentage >= 90 && !isUnlimited && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Approaching limit
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Usage Alerts */}
          {Object.values(usage).some(data => getUsagePercentage(data.used, data.limit) >= 90) && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 dark:text-orange-300">Usage Alert</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                    You're approaching your usage limits. Consider upgrading your plan to avoid interruptions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Billing History
        </h3>
        <div className="space-y-4">
          {subscription?.invoices?.slice(0, 3).map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentPlan?.name} Plan
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(invoice.created).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  €{(invoice.amount / 100).toFixed(2)}
                </p>
                <p className={`text-sm ${invoice.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {invoice.status}
                </p>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No billing history available
            </div>
          )}
        </div>
        {subscription?.status === 'active' && (
          <div className="mt-6 text-center">
            <button 
              onClick={openBillingPortal}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
            >
              View all billing history →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SubscriptionManager;