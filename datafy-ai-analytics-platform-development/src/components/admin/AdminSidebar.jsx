import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiHome, FiUsers, FiFileText, FiDollarSign, FiSettings, FiBarChart3, FiBot, FiDatabase, FiZap } = FiIcons;

const AdminSidebar = () => {
  const { adminUser, hasPermission } = useAdminAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/poweradmin/dashboard', icon: FiHome, permission: 'system.health' },
    { name: 'AI SEO Suite', href: '/poweradmin/seo', icon: FiZap, permission: 'seo.manage' },
    { name: 'User Management', href: '/poweradmin/users', icon: FiUsers, permission: 'users.manage' },
    { name: 'Content Management', href: '/poweradmin/content', icon: FiFileText, permission: 'content.edit' },
    { name: 'Billing & Subscriptions', href: '/poweradmin/billing', icon: FiDollarSign, permission: 'billing.manage' },
    { name: 'System Settings', href: '/poweradmin/settings', icon: FiSettings, permission: 'settings.manage' }
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-red-900 to-gray-900 border-r border-red-800 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-red-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <SafeIcon icon={FiShield} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">
              Power Admin
            </h1>
            <p className="text-xs text-red-200">
              System Control Panel
            </p>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-red-800">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-medium">
              {adminUser?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <p className="text-white font-medium text-sm">
            {adminUser?.name}
          </p>
          <p className="text-red-200 text-xs">
            {adminUser?.role?.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          if (!hasPermission(item.permission)) return null;
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-red-800/50 text-white border border-red-700'
                  : 'text-red-200 hover:bg-red-800/30 hover:text-white'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span>{item.name}</span>
              {item.name === 'AI SEO Suite' && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  NEW
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-red-800">
        <div className="bg-red-800/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">System Status</span>
          </div>
          <div className="space-y-1 text-xs text-red-200">
            <div className="flex justify-between">
              <span>Server</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-400">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span>AI SEO Engine</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>API</span>
              <span className="text-green-400">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;