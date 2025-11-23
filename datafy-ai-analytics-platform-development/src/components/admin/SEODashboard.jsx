import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import SEOAnalyzer from './SEOAnalyzer';
import BacklinkGenerator from './BacklinkGenerator';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiLink, FiTrendingUp, FiSettings, FiZap, FiTarget } = FiIcons;

const SEODashboard = () => {
  const [activeTab, setActiveTab] = useState('analyzer');

  const tabs = [
    {
      id: 'analyzer',
      name: 'On-Page SEO',
      icon: FiSearch,
      description: 'AI-powered on-page optimization'
    },
    {
      id: 'backlinks',
      name: 'Off-Page SEO',
      icon: FiLink,
      description: 'White-hat backlink opportunities'
    },
    {
      id: 'performance',
      name: 'SEO Performance',
      icon: FiTrendingUp,
      description: 'Rankings and analytics'
    },
    {
      id: 'settings',
      name: 'SEO Settings',
      icon: FiSettings,
      description: 'Configuration and automation'
    }
  ];

  const seoMetrics = [
    {
      title: 'Overall SEO Score',
      value: '78',
      change: '+12%',
      trend: 'up',
      color: 'bg-green-500'
    },
    {
      title: 'Pages Optimized',
      value: '24',
      change: '+8',
      trend: 'up',
      color: 'bg-blue-500'
    },
    {
      title: 'Backlinks Acquired',
      value: '156',
      change: '+23',
      trend: 'up',
      color: 'bg-purple-500'
    },
    {
      title: 'Avg. Page Speed',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up',
      color: 'bg-orange-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analyzer':
        return <SEOAnalyzer />;
      case 'backlinks':
        return <BacklinkGenerator />;
      case 'performance':
        return <SEOPerformance />;
      case 'settings':
        return <SEOSettings />;
      default:
        return <SEOAnalyzer />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiZap} className="w-6 h-6 text-white" />
            </div>
            <span>AI SEO Optimization Suite</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Fully automated SEO optimization powered by AI - no plugins, no hassle!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-300">AI Engine Active</span>
        </div>
      </motion.div>

      {/* SEO Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {seoMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={FiTarget} className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
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

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5" />
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs text-gray-400">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </motion.div>
    </div>
  );
};

// SEO Performance Component
const SEOPerformance = () => {
  const performanceData = [
    { keyword: 'AI analytics platform', position: 3, change: '+2', traffic: 1240 },
    { keyword: 'data visualization tool', position: 7, change: '+1', traffic: 890 },
    { keyword: 'business intelligence', position: 12, change: '-1', traffic: 650 },
    { keyword: 'conversational AI', position: 5, change: '+3', traffic: 1100 }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Keyword Rankings & Performance
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Monthly Traffic
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
            {performanceData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.keyword}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  #{item.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.traffic.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SEO Settings Component
const SEOSettings = () => {
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [scheduleScans, setScheduleScans] = useState(true);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        SEO Automation Settings
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Auto-Optimize Pages</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automatically apply AI-suggested optimizations
            </p>
          </div>
          <button
            onClick={() => setAutoOptimize(!autoOptimize)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              autoOptimize ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoOptimize ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Scheduled SEO Scans</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Run weekly SEO analysis on all pages
            </p>
          </div>
          <button
            onClick={() => setScheduleScans(!scheduleScans)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              scheduleScans ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              scheduleScans ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEODashboard;