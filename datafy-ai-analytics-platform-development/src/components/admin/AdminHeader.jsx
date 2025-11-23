import React from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSun, FiMoon, FiBell, FiLogOut, FiShield } = FiIcons;

const AdminHeader = () => {
  const { adminUser, adminSignOut } = useAdminAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      adminSignOut();
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
          </div>
          <div className="hidden md:block px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs font-medium rounded-full">
            RESTRICTED ACCESS
          </div>
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
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {adminUser?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {adminUser?.role?.replace('_', ' ')}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {adminUser?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;