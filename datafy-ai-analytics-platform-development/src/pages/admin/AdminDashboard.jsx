import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import SafeIcon from '../../components/common/SafeIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AIHelpDesk from '../../components/admin/AIHelpDesk';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, FiServer, FiActivity, FiDollarSign, FiAlertTriangle, 
  FiCheckCircle, FiClock, FiTrendingUp, FiDatabase, FiCpu,
  FiHardDrive, FiWifi, FiZap
} = FiIcons;

const AdminDashboard = () => {
  const { adminUser, hasPermission } = useAdminAuth();
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading system health data
    const loadSystemHealth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSystemHealth({
        server: {
          status: 'healthy',
          uptime: '15 days, 8 hours',
          cpu: 34,
          memory: 67,
          disk: 45
        },
        database: {
          status: 'healthy',
          connections: 145,
          avgResponseTime: '12ms',
          queries: 15420
        },
        api: {
          status: 'healthy',
          requests: 892340,
          errors: 23,
          avgLatency: '87ms'
        },
        users: {
          total: 12540,
          active: 3420,
          new: 156
        },
        billing: {
          revenue: 328000,
          subscriptions: 2340,
          churn: 2.3
        }
      });
      
      setLoading(false);
    };

    loadSystemHealth();
  }, []);

  const systemMetrics = [
    {
      title: 'Total Users',
      value: systemHealth.users?.total?.toLocaleString() || '0',
      change: '+12%',
      trend: 'up',
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Server Uptime',
      value: systemHealth.server?.uptime || '0 days',
      change: '99.9%',
      trend: 'up',
      icon: FiServer,
      color: 'bg-green-500'
    },
    {
      title: 'API Requests',
      value: systemHealth.api?.requests?.toLocaleString() || '0',
      change: '+24%',
      trend: 'up',
      icon: FiActivity,
      color: 'bg-purple-500'
    },
    {
      title: 'Monthly Revenue',
      value: `$${systemHealth.billing?.revenue?.toLocaleString() || '0'}`,
      change: '+18%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'bg-orange-500'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High Memory Usage',
      description: 'Server memory usage at 67% - consider scaling',
      timestamp: '2 minutes ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Backup Completed',
      description: 'Daily database backup completed successfully',
      timestamp: '1 hour ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'SSL Certificate Renewed',
      description: 'SSL certificate auto-renewed for 1 year',
      timestamp: '3 hours ago',
      severity: 'low'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return FiAlertTriangle;
      case 'success': return FiCheckCircle;
      case 'info': return FiClock;
      default: return FiAlertTriangle;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

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
            Power Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back, {adminUser.name} ({adminUser.role.replace('_', ' ')})
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600 dark:text-gray-300">System Operational</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'System Overview', permission: 'system.health' },
            { id: 'ai-help', name: 'AI Help Desk', permission: 'ai.helpdesk' }
          ].map((tab) => (
            hasPermission(tab.permission) && (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            )
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && hasPermission('system.health') && (
        <div className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => (
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
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <SafeIcon icon={metric.trend === 'up' ? FiTrendingUp : FiTrendingUp} className="w-4 h-4" />
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

          {/* System Health Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Server Health */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiServer} className="w-5 h-5 text-blue-500" />
                <span>Server Health</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCpu} className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${systemHealth.server.cpu}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {systemHealth.server.cpu}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiHardDrive} className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Memory</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${systemHealth.server.memory}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {systemHealth.server.memory}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiDatabase} className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Disk Space</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${systemHealth.server.disk}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {systemHealth.server.disk}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Database Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiDatabase} className="w-5 h-5 text-green-500" />
                <span>Database Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Connections</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {systemHealth.database.connections}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {systemHealth.database.avgResponseTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Queries Today</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {systemHealth.database.queries.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Alerts
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <SafeIcon 
                      icon={getAlertIcon(alert.type)} 
                      className={`w-5 h-5 mt-0.5 ${getAlertColor(alert.type)}`} 
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {alert.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'ai-help' && hasPermission('ai.helpdesk') && (
        <AIHelpDesk />
      )}
    </div>
  );
};

export default AdminDashboard;