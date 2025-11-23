import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiDatabase, FiFileText, FiUsers, FiDollarSign, FiArrowRight } = FiIcons;

const Dashboard = () => {
  const { dataSources, reports, insights, loading } = useData();

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, growth: 12 },
    { month: 'Feb', revenue: 52000, growth: 15 },
    { month: 'Mar', revenue: 48000, growth: -8 },
    { month: 'Apr', revenue: 61000, growth: 27 },
    { month: 'May', revenue: 55000, growth: -10 },
    { month: 'Jun', revenue: 67000, growth: 22 },
  ];

  const customerData = [
    { name: 'New', value: 400, color: '#f97316' },
    { name: 'Returning', value: 300, color: '#2dd4bf' },
    { name: 'Churned', value: 100, color: '#ef4444' },
  ];

  const metricsData = [
    {
      title: 'Total Revenue',
      value: '$328,000',
      change: '+23%',
      trend: 'up',
      icon: FiDollarSign,
    },
    {
      title: 'Active Users',
      value: '12,540',
      change: '+12%',
      trend: 'up',
      icon: FiUsers,
    },
    {
      title: 'Data Sources',
      value: dataSources.length.toString(),
      change: '+3',
      trend: 'up',
      icon: FiDatabase,
    },
    {
      title: 'Reports Generated',
      value: reports.length.toString(),
      change: '+8',
      trend: 'up',
      icon: FiFileText,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Your data analytics at a glance
          </p>
        </div>
        <button className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <span>Generate Report</span>
          <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                <SafeIcon icon={metric.icon} className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                <SafeIcon icon={metric.trend === 'up' ? FiTrendingUp : FiTrendingDown} className="w-4 h-4" />
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#gradient)"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Customer Segmentation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Segmentation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {customerData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI-Generated Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'positive'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-400'
                  : insight.type === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
              }`}
            >
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {insight.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {insight.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Confidence: {Math.round(insight.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-400 rounded-xl p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Ready to dive deeper?</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Ask AI a Question
          </button>
          <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Upload New Data
          </button>
          <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Create Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;