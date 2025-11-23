import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiDatabase, FiFile, FiPlus, FiRefreshCw, FiTrash2, FiEye, FiDownload } = FiIcons;

const DataSources = () => {
  const { dataSources, uploadDataSource, loading } = useData();
  const [uploadLoading, setUploadLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploadLoading(true);
    try {
      const file = acceptedFiles[0];
      await uploadDataSource(file, {
        description: `Uploaded ${file.name}`,
      });
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploadLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'csv':
      case 'excel':
        return FiFile;
      case 'postgresql':
      case 'mysql':
        return FiDatabase;
      default:
        return FiFile;
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
            Data Sources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your data connections and uploads
          </p>
        </div>
        <button className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add Connector</span>
        </button>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upload New Data
        </h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto">
              {uploadLoading ? (
                <LoadingSpinner size="md" />
              ) : (
                <SafeIcon icon={FiUpload} className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your data file'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                or click to browse • CSV, Excel, JSON, PDF supported
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Sources List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connected Data Sources
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {dataSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={getFileIcon(source.type)} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {source.type} • {source.size}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {source.records.toLocaleString()} records
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200">
                    <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Available Connectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Connectors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'PostgreSQL', icon: FiDatabase, color: 'bg-blue-500' },
            { name: 'MySQL', icon: FiDatabase, color: 'bg-orange-500' },
            { name: 'MongoDB', icon: FiDatabase, color: 'bg-green-500' },
            { name: 'AWS S3', icon: FiDatabase, color: 'bg-yellow-500' },
            { name: 'Google Sheets', icon: FiFile, color: 'bg-green-600' },
            { name: 'Salesforce', icon: FiDatabase, color: 'bg-blue-600' },
            { name: 'HubSpot', icon: FiDatabase, color: 'bg-orange-600' },
            { name: 'Stripe', icon: FiDatabase, color: 'bg-purple-500' },
          ].map((connector) => (
            <button
              key={connector.name}
              className="p-4 border border-gray-200 dark:border-dark-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-center"
            >
              <div className={`w-10 h-10 ${connector.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <SafeIcon icon={connector.icon} className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {connector.name}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DataSources;