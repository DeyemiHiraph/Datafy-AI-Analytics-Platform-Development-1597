import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import SafeIcon from '../../components/common/SafeIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiMail, FiLock, FiEye, FiEyeOff } = FiIcons;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminSignIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/poweradmin/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await adminSignIn(formData.email, formData.password, formData.twoFactorCode);
      if (result.success) {
        toast.success(`Welcome back, ${result.admin.name}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Warning Banner */}
      <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm">
        🔒 RESTRICTED ACCESS - Authorized Personnel Only
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 mt-8"
      >
        {/* Logo and Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Power Admin Panel
          </h1>
          <p className="text-gray-300">
            Datafy System Administration
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Two-Factor Code (Optional) */}
            <div>
              <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-300 mb-2">
                2FA Code (if enabled)
              </label>
              <input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                value={formData.twoFactorCode}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Authenticating...
              </>
            ) : (
              'Access Admin Panel'
            )}
          </button>

          {/* Demo Credentials */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-medium text-yellow-300 mb-2">
              Demo Credentials
            </h3>
            <div className="text-xs text-yellow-200 space-y-1">
              <div>Power Admin: poweradmin@datafy.com / admin123</div>
              <div>Editor: editor@datafy.com / admin123</div>
            </div>
          </div>
        </motion.form>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-300 transition-colors duration-200 text-sm"
          >
            ← Back to Main Site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;