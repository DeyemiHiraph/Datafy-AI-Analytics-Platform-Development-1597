import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe, createCheckoutSession, PRICING_PLANS } from '../../services/stripe';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiCreditCard, FiZap, FiUsers, FiDatabase } = FiIcons;

const PricingPlans = ({ currentPlan = 'starter', onUpgrade }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState('');
  const [stripePromise] = useState(() => getStripe());

  const handleUpgrade = async (planId, priceId) => {
    if (!user || loading) return;

    setLoading(planId);
    try {
      await createCheckoutSession(priceId, user.id);
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const getPlanFeatures = (plan) => {
    return PRICING_PLANS[plan]?.features || [];
  };

  const getPlanLimitations = (plan) => {
    const allFeatures = [
      'Advanced AI editors',
      'Voice queries',
      'Slack/Teams integration',
      'Unlimited storage',
      'API access',
      'White-label solution',
      'Dedicated support'
    ];
    
    const planFeatures = getPlanFeatures(plan);
    return allFeatures.filter(feature => 
      !planFeatures.some(pf => pf.toLowerCase().includes(feature.toLowerCase().split(' ')[0]))
    );
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Unlock powerful AI features and integrations with our flexible pricing plans
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(PRICING_PLANS).map(([planId, plan]) => (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Object.keys(PRICING_PLANS).indexOf(planId) * 0.1 }}
                className={`relative bg-white dark:bg-dark-800 rounded-2xl shadow-xl border-2 transition-all duration-200 ${
                  planId === 'business'
                    ? 'border-primary-500 dark:border-primary-400 scale-105'
                    : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                {/* Popular Badge */}
                {planId === 'business' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      planId === 'starter' 
                        ? 'bg-gray-100 dark:bg-gray-700' 
                        : planId === 'business' 
                        ? 'bg-gradient-to-br from-primary-500 to-secondary-400' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      <SafeIcon 
                        icon={planId === 'starter' ? FiUsers : planId === 'business' ? FiZap : FiDatabase} 
                        className={`w-8 h-8 ${planId === 'starter' ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`} 
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        €{plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">
                        {plan.price === 0 ? 'forever' : '/month'}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {/* Limitations for current plan comparison */}
                    {planId !== 'enterprise' && getPlanLimitations(planId).slice(0, 2).map((limitation, index) => (
                      <div key={`limitation-${index}`} className="flex items-center space-x-3 opacity-60">
                        <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => planId !== 'starter' && handleUpgrade(planId, plan.priceId)}
                    disabled={loading === planId || currentPlan === planId}
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentPlan === planId
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : planId === 'starter'
                        ? 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600'
                        : planId === 'business'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-400 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    } disabled:opacity-50`}
                  >
                    {loading === planId ? (
                      <LoadingSpinner size="sm" />
                    ) : currentPlan === planId ? (
                      'Current Plan'
                    ) : planId === 'starter' ? (
                      'Free Forever'
                    ) : (
                      <>
                        <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </>
                    )}
                  </button>

                  {/* Usage Limits */}
                  {planId !== 'starter' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Usage Limits:</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span>AI Queries</span>
                          <span>{plan.limits.aiQueries === -1 ? 'Unlimited' : plan.limits.aiQueries.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Sources</span>
                          <span>{plan.limits.dataSources === -1 ? 'Unlimited' : plan.limits.dataSources}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Storage</span>
                          <span>
                            {plan.limits.storage === -1 ? 'Unlimited' : `${plan.limits.storage / 1024}GB`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Feature
                    </th>
                    {Object.entries(PRICING_PLANS).map(([planId, plan]) => (
                      <th key={planId} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                  {[
                    { feature: 'AI SQL Editor', starter: false, business: true, enterprise: true },
                    { feature: 'AI Python Editor', starter: false, business: true, enterprise: true },
                    { feature: 'Voice Queries', starter: false, business: true, enterprise: true },
                    { feature: 'Slack Integration', starter: false, business: true, enterprise: true },
                    { feature: 'Teams Integration', starter: false, business: false, enterprise: true },
                    { feature: 'API Access', starter: false, business: false, enterprise: true },
                    { feature: 'White-label', starter: false, business: false, enterprise: true }
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {row.feature}
                      </td>
                      {Object.keys(PRICING_PLANS).map((planId) => (
                        <td key={planId} className="px-6 py-4 whitespace-nowrap text-center">
                          <SafeIcon 
                            icon={row[planId] ? FiCheck : FiX} 
                            className={`w-5 h-5 mx-auto ${row[planId] ? 'text-green-500' : 'text-gray-300'}`} 
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default PricingPlans;