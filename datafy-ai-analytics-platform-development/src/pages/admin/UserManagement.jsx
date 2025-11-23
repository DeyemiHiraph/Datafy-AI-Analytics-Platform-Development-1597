import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import SafeIcon from '../../components/common/SafeIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, FiPlus, FiEdit, FiTrash2, FiEye, FiLock, 
  FiUnlock, FiMail, FiCalendar, FiActivity, FiSearch 
} = FiIcons;

const UserManagement = () => {
  const { hasPermission } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    // Load mock users data
    const loadUsers = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'Business',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          joinDate: '2023-06-15T00:00:00Z',
          dataSourcesCount: 5,
          reportsCount: 12,
          subscription: 'Business Plan'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          role: 'Enterprise',
          status: 'active',
          lastLogin: '2024-01-14T15:45:00Z',
          joinDate: '2023-03-22T00:00:00Z',
          dataSourcesCount: 15,
          reportsCount: 34,
          subscription: 'Enterprise Plan'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike@startup.io',
          role: 'Starter',
          status: 'inactive',
          lastLogin: '2024-01-10T09:15:00Z',
          joinDate: '2024-01-01T00:00:00Z',
          dataSourcesCount: 2,
          reportsCount: 3,
          subscription: 'Starter Plan'
        },
        {
          id: '4',
          name: 'Emily Chen',
          email: 'emily@tech.com',
          role: 'Business',
          status: 'suspended',
          lastLogin: '2024-01-12T14:20:00Z',
          joinDate: '2023-09-10T00:00:00Z',
          dataSourcesCount: 8,
          reportsCount: 19,
          subscription: 'Business Plan'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Business': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Starter': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleUserAction = (action, userId) => {
    // Handle user actions (suspend, activate, delete, etc.)
    console.log(`${action} user ${userId}`);
  };

  if (!hasPermission('users.manage')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage users.</p>
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
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <button className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Business">Business</option>
            <option value="Starter">Starter</option>
          </select>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <SafeIcon icon={FiMail} className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiActivity} className="w-3 h-3 text-gray-400" />
                        <span>Last: {new Date(user.lastLogin).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.dataSourcesCount} sources, {user.reportsCount} reports
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                      <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction('edit', user.id)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900/20"
                      >
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.status === 'active' ? 'suspend' : 'activate', user.id)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          user.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        <SafeIcon icon={user.status === 'active' ? FiLock : FiUnlock} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction('delete', user.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { title: 'Total Users', value: users.length, color: 'bg-blue-500' },
          { title: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'bg-green-500' },
          { title: 'Suspended', value: users.filter(u => u.status === 'suspended').length, color: 'bg-red-500' },
          { title: 'Enterprise', value: users.filter(u => u.role === 'Enterprise').length, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default UserManagement;