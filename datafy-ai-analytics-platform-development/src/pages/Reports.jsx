import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiPlus, FiDownload, FiEye, FiShare2, FiTrash2, FiClock, FiTrendingUp } = FiIcons;

const Reports = () => {
  const { reports, generateReport, loading } = useData();
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      await generateReport({
        title: 'New Analytics Report',
        type: 'Analytics',
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Executive Summary':
        return FiTrendingUp;
      case 'Predictive Analytics':
        return FiTrendingUp;
      case 'Dashboard':
        return FiFileText;
      default:
        return FiFileText;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Generate and manage your data reports
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generatingReport ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Reports
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Insights
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.reduce((acc, report) => acc + report.insights, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-400 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Generated Reports
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={getTypeIcon(report.type)} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {report.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {report.type}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="w-3 h-3" />
                        <span>{format(new Date(report.created_at), 'MMM dd, yyyy')}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {report.insights} insights
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-secondary-500 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors duration-200">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                    <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Report Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Executive Summary',
              description: 'High-level overview with key metrics and trends',
              icon: FiTrendingUp,
              color: 'bg-blue-500',
            },
            {
              title: 'Sales Performance',
              description: 'Detailed analysis of sales data and performance',
              icon: FiFileText,
              color: 'bg-green-500',
            },
            {
              title: 'Customer Analytics',
              description: 'Customer behavior and segmentation insights',
              icon: FiTrendingUp,
              color: 'bg-purple-500',
            },
            {
              title: 'Financial Report',
              description: 'Revenue, expenses, and financial health analysis',
              icon: FiFileText,
              color: 'bg-orange-500',
            },
            {
              title: 'Marketing ROI',
              description: 'Marketing campaign effectiveness and ROI',
              icon: FiTrendingUp,
              color: 'bg-pink-500',
            },
            {
              title: 'Operational Insights',
              description: 'Operational efficiency and process optimization',
              icon: FiFileText,
              color: 'bg-indigo-500',
            },
          ].map((template) => (
            <button
              key={template.title}
              className="p-4 border border-gray-200 dark:border-dark-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-left"
            >
              <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center mb-3`}>
                <SafeIcon icon={template.icon} className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {template.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;