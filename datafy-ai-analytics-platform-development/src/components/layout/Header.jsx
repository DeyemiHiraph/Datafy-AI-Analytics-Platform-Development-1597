import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { testOpenAIConnection } from '../../services/dataAnalytics';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiZap, FiAlertTriangle } = FiIcons;

const Header = () => {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [aiStatus, setAiStatus] = useState('checking');

  useEffect(() => {
    // Test OpenAI connection on component mount
    const checkAI = async () => {
      const connected = await testOpenAIConnection();
      setAiStatus(connected ? 'connected' : 'disconnected');
    };
    
    checkAI();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const getAiStatusIndicator = () => {
    switch (aiStatus) {
      case 'connected':
        return (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">AI Engine Active</span>
            <SafeIcon icon={FiZap} className="w-3 h-3" />
          </div>
        );
      case 'disconnected':
        return (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs font-medium">AI Engine Offline</span>
            <SafeIcon icon={FiAlertTriangle} className="w-3 h-3" />
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Checking AI Status...</span>
          </div>
        );
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
          </h2>
          
          {/* AI Status Indicator */}
          {getAiStatusIndicator()}
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
          >
            <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200 relative">
            <SafeIcon icon={FiBell} className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;