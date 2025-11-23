import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiShare2, FiDownload, FiExternalLink, FiImage, FiPresentation } = FiIcons;

const ReportPreview = ({ report, onShare }) => {
  if (!report) return null;

  const handleShare = (type) => {
    switch (type) {
      case 'link':
        navigator.clipboard.writeText(report.shareableLink);
        break;
      case 'image':
        // Would implement image export
        console.log('Export as image');
        break;
      case 'powerpoint':
        // Would implement PowerPoint export
        console.log('Export as PowerPoint');
        break;
      default:
        onShare && onShare();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <SafeIcon icon={FiFileText} className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            📋 {report.title}
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {report.summary}
          </p>

          {/* Key Findings */}
          {report.keyFindings && report.keyFindings.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Key Findings:
              </h5>
              <ul className="space-y-1">
                {report.keyFindings.slice(0, 3).map((finding, index) => (
                  <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                💡 Recommendations:
              </h5>
              <ul className="space-y-1">
                {report.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-1">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-3 border-t border-blue-200 dark:border-blue-800">
            <button
              onClick={() => window.open(`/app/reports/${report.id}`, '_blank')}
              className="flex items-center space-x-1 text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-200"
            >
              <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
              <span>View Full Report</span>
            </button>

            <button
              onClick={() => handleShare('link')}
              className="flex items-center space-x-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <SafeIcon icon={FiShare2} className="w-3 h-3" />
              <span>Share Link</span>
            </button>

            <button
              onClick={() => handleShare('image')}
              className="flex items-center space-x-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <SafeIcon icon={FiImage} className="w-3 h-3" />
              <span>PNG</span>
            </button>

            <button
              onClick={() => handleShare('powerpoint')}
              className="flex items-center space-x-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <SafeIcon icon={FiPresentation} className="w-3 h-3" />
              <span>PPT</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportPreview;