import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFile, FiBarChart3, FiEye, FiX, FiDownload, FiChevronDown, FiChevronRight } = FiIcons;

const FilePreview = ({ files, onRemoveFile, onFileSelect }) => {
  const [expandedFiles, setExpandedFiles] = useState(new Set());

  if (!files || files.length === 0) return null;

  const toggleFileExpanded = (fileId) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
    }
    setExpandedFiles(newExpanded);
  };

  const getFileIcon = (file) => {
    if (file.data?.type === 'csv' || file.name.endsWith('.csv')) return FiBarChart3;
    if (file.data?.type === 'excel' || file.name.match(/\.(xlsx|xls)$/)) return FiBarChart3;
    if (file.data?.type === 'json') return FiFile;
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileContent = (file) => {
    if (!file.data) return null;

    const isExpanded = expandedFiles.has(file.id);

    switch (file.data.type) {
      case 'csv':
        return (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {file.data.summary}
            </div>
            {isExpanded && file.data.headers && (
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 text-xs">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Columns: {file.data.headers.join(', ')}
                </div>
                {file.data.preview && file.data.preview.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sample data:
                    </div>
                    <div className="overflow-auto max-h-32">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            {file.data.headers.slice(0, 4).map((header, i) => (
                              <th key={i} className="text-left p-1 font-medium">
                                {header}
                              </th>
                            ))}
                            {file.data.headers.length > 4 && <th className="text-left p-1">...</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {file.data.preview.slice(0, 3).map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                              {row.slice(0, 4).map((cell, j) => (
                                <td key={j} className="p-1 truncate max-w-20">
                                  {cell}
                                </td>
                              ))}
                              {row.length > 4 && <td className="p-1">...</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'json':
        return (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {file.data.summary}
            </div>
            {isExpanded && file.data.keys && (
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 text-xs">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fields: {file.data.keys.join(', ')}
                </div>
                {file.data.data && (
                  <pre className="text-xs overflow-auto max-h-32 text-gray-600 dark:text-gray-400">
                    {JSON.stringify(file.data.data, null, 2).slice(0, 200)}...
                  </pre>
                )}
              </div>
            )}
          </div>
        );

      case 'excel':
        return (
          <div className="mt-3">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {file.data.summary}
            </div>
            {file.data.note && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {file.data.note}
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="mt-3">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {file.data.summary}
            </div>
            {isExpanded && file.data.content && (
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 mt-2">
                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {file.data.content}
                </pre>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="mt-3">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              File ready for analysis
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 dark:bg-dark-700 border-t border-gray-200 dark:border-dark-600 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Uploaded Files ({files.length})
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Ready for analysis
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-3"
          >
            <div className="flex items-start space-x-3">
              <SafeIcon 
                icon={getFileIcon(file)} 
                className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h5 className="font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h5>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                
                {file.data && (
                  <button
                    onClick={() => toggleFileExpanded(file.id)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-primary-500 transition-colors duration-200 mt-1"
                  >
                    <SafeIcon 
                      icon={expandedFiles.has(file.id) ? FiChevronDown : FiChevronRight} 
                      className="w-3 h-3" 
                    />
                    <span>
                      {expandedFiles.has(file.id) ? 'Hide details' : 'Show details'}
                    </span>
                  </button>
                )}

                {renderFileContent(file)}
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  onClick={() => onFileSelect && onFileSelect(file)}
                  className="p-1.5 text-gray-400 hover:text-primary-500 rounded transition-colors duration-200"
                  title="View file"
                >
                  <SafeIcon icon={FiEye} className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors duration-200"
                  title="Remove file"
                >
                  <SafeIcon icon={FiX} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-600">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const message = `Analyze the uploaded files and provide a summary of the data structure and key insights.`;
              // This would trigger the chat message
              console.log('Auto-suggest:', message);
            }}
            className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors duration-200"
          >
            📊 Analyze structure
          </button>
          <button
            onClick={() => {
              const message = `Show me the key statistics and insights from my uploaded data.`;
              console.log('Auto-suggest:', message);
            }}
            className="text-xs bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded hover:bg-secondary-200 dark:hover:bg-secondary-900/40 transition-colors duration-200"
          >
            📈 Key insights
          </button>
          <button
            onClick={() => {
              const message = `Create visualizations from my uploaded data.`;
              console.log('Auto-suggest:', message);
            }}
            className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors duration-200"
          >
            📊 Create charts
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilePreview;