import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import SafeIcon from '../../components/common/SafeIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { 
  FiDollarSign, FiCreditCard, FiTrendingUp, FiUsers, 
  FiCalendar, FiAlertCircle, FiCheckCircle, FiX,
  FiRefreshCw, FiDownload, FiEye
} = FiIcons;

const BillingManagement = () => {
  const { hasPermission } = useAdminAuth();
  const [billingData, setBillingData] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Load mock billing data
    const loadBillingData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBillingData({
        revenue: {
          total: 328000,
          monthly: 27333,
          growth: 18.5
        },
        subscriptions: {
          total: 2340,
          active: 2156,
          cancelled: 184,
          churnRate: 2.3
        },
        plans: {
          starter: { count: 1200, revenue: 0 },
          business: { count: 980, revenue: 490000 },
          enterprise: { count: 160, revenue: 240000 }
        }
      });

      setSubscriptions([
        {
          id: 'sub_1',
          customer: 'John Smith',
          email: 'john@example.com',
          plan: 'Business',
          status: 'active',
          amount: 500,
          currency: 'EUR',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-02-01',
          created: '2023-06-15'
        },
        {
          id: 'sub_2',
          customer: 'Sarah Johnson',
          email: 'sarah@company.com',
          plan: 'Enterprise',
          status: 'active',
          amount: 1500,
          currency: 'EUR',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-02-01',
          created: '2023-03-22'
        },
        {
          id: 'sub_3',
          customer: 'Mike Davis',
          email: 'mike@startup.io',
          plan: 'Business',
          status: 'past_due',
          amount: 500,
          currency: 'EUR',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-02-01',
          created: '2024-01-01'
        },
        {
          id: 'sub_4',
          customer: 'Emily Chen',
          email: 'emily@tech.com',
          plan: 'Enterprise',
          status: 'cancelled',
          amount: 1500,
          currency: 'EUR',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-02-01',
          created: '2023-09-10'
        }
      ]);

      setLoading(false);
    };

    loadBillingData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'past_due': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'trialing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Business': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Starter': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleSubscriptionAction = (action, subscriptionId) => {
    console.log(`${action} subscription ${subscriptionId}`);
    // Implement Stripe API calls here
  };

  if (!hasPermission('billing.manage')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage billing.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor revenue, manage subscriptions, and handle billing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `€${billingData.revenue?.total?.toLocaleString() || '0'}`,
            change: `+${billingData.revenue?.growth || 0}%`,
            trend: 'up',
            icon: FiDollarSign,
            color: 'bg-green-500'
          },
          {
            title: 'Monthly Revenue',
            value: `€${billingData.revenue?.monthly?.toLocaleString() || '0'}`,
            change: '+12%',
            trend: 'up',
            icon: FiTrendingUp,
            color: 'bg-blue-500'
          },
          {
            title: 'Active Subscriptions',
            value: billingData.subscriptions?.active?.toLocaleString() || '0',
            change: '+8%',
            trend: 'up',
            icon: FiUsers,
            color: 'bg-purple-500'
          },
          {
            title: 'Churn Rate',
            value: `${billingData.subscriptions?.churnRate || 0}%`,
            change: '-0.5%',
            trend: 'down',
            icon: FiAlertCircle,
            color: 'bg-orange-500'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={metric.icon} className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                <span>{metric.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {metric.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Plan Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Subscription Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(billingData.plans || {}).map(([planName, data]) => (
            <div key={planName} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                planName === 'enterprise' ? 'bg-purple-100 dark:bg-purple-900/20' :
                planName === 'business' ? 'bg-blue-100 dark:bg-blue-900/20' :
                'bg-yellow-100 dark:bg-yellow-900/20'
              }`}>
                <SafeIcon icon={FiCreditCard} className={`w-8 h-8 ${
                  planName === 'enterprise' ? 'text-purple-600' :
                  planName === 'business' ? 'text-blue-600' :
                  'text-yellow-600'
                }`} />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                {planName}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {data.count}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                €{data.revenue.toLocaleString()} revenue
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscriptions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Subscriptions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {subscriptions.map((subscription, index) => (
                <motion.tr
                  key={subscription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {subscription.customer}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {subscription.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(subscription.plan)}`}>
                        {subscription.plan}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    €{subscription.amount}/month
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                      <span>
                        {new Date(subscription.currentPeriodStart).toLocaleDateString()} - 
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleSubscriptionAction('view', subscription.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                      </button>
                      {subscription.status === 'past_due' && (
                        <button
                          onClick={() => handleSubscriptionAction('retry', subscription.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                        </button>
                      )}
                      {subscription.status === 'active' && (
                        <button
                          onClick={() => handleSubscriptionAction('cancel', subscription.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default BillingManagement;