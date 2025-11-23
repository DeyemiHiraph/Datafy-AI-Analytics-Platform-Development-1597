import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import SafeIcon from '../components/common/SafeIcon';
import SQLEditor from '../components/ai/SQLEditor';
import PythonEditor from '../components/ai/PythonEditor';
import PandasEditor from '../components/ai/PandasEditor';
import VoiceQuery from '../components/ai/VoiceQuery';
import * as FiIcons from 'react-icons/fi';

const { FiCode, FiDatabase, FiMic, FiZap, FiLock } = FiIcons;

const AIWorkspace = () => {
  const { user } = useAuth();
  const { subscription, hasFeatureAccess } = useSubscription();
  const [activeTab, setActiveTab] = useState('sql');

  const tabs = [
    {
      id: 'sql',
      name: 'SQL Editor',
      icon: FiDatabase,
      description: 'AI-powered SQL query assistant',
      requiredPlan: 'business'
    },
    {
      id: 'python',
      name: 'Python Editor',
      icon: FiCode,
      description: 'AI-assisted Python development',
      requiredPlan: 'business'
    },
    {
      id: 'pandas',
      name: 'Pandas Generator',
      icon: FiZap,
      description: 'AI-generated data analysis code',
      requiredPlan: 'business'
    },
    {
      id: 'voice',
      name: 'Voice Queries',
      icon: FiMic,
      description: 'Speak your data questions',
      requiredPlan: 'business'
    }
  ];

  const renderTabContent = () => {
    const hasAccess = hasFeatureAccess(tabs.find(t => t.id === activeTab)?.requiredPlan);

    if (!hasAccess) {
      return (
        <div className="text-center py-12">
          <SafeIcon icon={FiLock} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Upgrade Required
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This feature requires a Business plan or higher.
          </p>
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Upgrade Now
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'sql':
        return <SQLEditor schema="-- Available tables and schema will be loaded here" />;
      case 'python':
        return <PythonEditor context="Data analysis environment with pandas, matplotlib, seaborn" />;
      case 'pandas':
        return <PandasEditor dataDescription="Your connected data sources and their structure" />;
      case 'voice':
        return <VoiceQuery onVoiceQuery={(query) => console.log('Voice query:', query)} />;
      default:
        return null;
    }
  };

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
            AI Workspace
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Powerful AI-assisted development tools for data analysis
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600 dark:text-gray-300">AI Models Active</span>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const hasAccess = hasFeatureAccess(tab.requiredPlan);
              return (
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
                    <div className="flex items-center space-x-2">
                      <span>{tab.name}</span>
                      {!hasAccess && <SafeIcon icon={FiLock} className="w-3 h-3" />}
                    </div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </motion.div>

      {/* AI Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Queries Used</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">45</span>
            <span className="text-gray-500">/ 1000</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '4.5%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Code Generated</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">23</span>
            <span className="text-gray-500">snippets</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Voice Queries</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">8</span>
            <span className="text-gray-500">processed</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">This week</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AIWorkspace;