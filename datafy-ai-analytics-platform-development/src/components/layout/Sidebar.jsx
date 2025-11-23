import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiHome,
  FiMessageCircle,
  FiDatabase,
  FiFileText,
  FiSettings,
  FiBarChart3,
  FiCode,
  FiCreditCard,
  FiLock,
  FiZap,
  FiCheckCircle
} = FiIcons;

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: FiHome },
  { name: 'AI Chat', href: '/app/chat', icon: FiMessageCircle },
  { name: 'AI Workspace', href: '/app/ai-workspace', icon: FiCode, premium: true },
  { name: 'Data Sources', href: '/app/data-sources', icon: FiDatabase },
  { name: 'Reports', href: '/app/reports', icon: FiFileText },
  { name: 'Settings', href: '/app/settings', icon: FiSettings },
];

const Sidebar = () => {
  const location = useLocation();
  const { subscription, hasFeatureAccess } = useSubscription();

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-3">
          <img
            src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751484427009-Datafys_Logo_-_Black_Font_Transparent-removebg-preview%20-%20Copy.png"
            alt="Datafy Logo"
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const hasAccess = item.premium ? hasFeatureAccess('ai_editors') : true;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
              } ${!hasAccess ? 'opacity-60' : ''}`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>
              {item.premium && (
                <div className="flex items-center space-x-1">
                  {hasAccess ? (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                      PRO
                    </span>
                  ) : (
                    <SafeIcon icon={FiLock} className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Subscription Banner */}
      <div className="p-4">
        {subscription?.plan === 'starter' ? (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-400 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiZap} className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Upgrade to Pro</h3>
            </div>
            <p className="text-xs opacity-90 mb-3">
              Unlock AI editors, voice queries, and advanced analytics
            </p>
            <button 
              onClick={() => window.location.href = '/app/upgrade'}
              className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
            >
              Upgrade Now
            </button>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-sm text-green-900 dark:text-green-300">
                {subscription?.plan?.charAt(0).toUpperCase() + subscription?.plan?.slice(1)} Plan
              </h3>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mb-3">
              All premium features unlocked
            </p>
            <button 
              onClick={() => window.location.href = '/app/subscription'}
              className="w-full bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 text-green-900 dark:text-green-300 text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
            >
              Manage Subscription
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;