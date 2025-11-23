import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import { generatePandasCode } from '../../services/openai';
import { useSubscription } from '../../contexts/SubscriptionContext';
import * as FiIcons from 'react-icons/fi';

const { FiDatabase, FiZap, FiPlay, FiDownload, FiBarChart3, FiTable, FiLock } = FiIcons;

const PandasEditor = ({ dataDescription = '', onCodeGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [examples] = useState([
    'Create a pivot table showing revenue by product category',
    'Calculate monthly growth rate for sales',
    'Find top 10 customers by total purchase amount',
    'Create a correlation matrix for numerical columns',
    'Group data by region and calculate average metrics',
    'Filter data for the last 6 months and create summary statistics'
  ]);
  const { hasFeatureAccess, canUseFeature, incrementUsage } = useSubscription();

  const hasAccess = hasFeatureAccess('ai_editors');

  const generateCode = async (userPrompt) => {
    if (!hasAccess) {
      alert('AI Pandas Editor requires a Business plan or higher. Please upgrade to continue.');
      return;
    }

    if (!userPrompt.trim() || isGenerating) return;

    if (!canUseFeature('aiQueries')) {
      alert('AI query limit reached. Please upgrade your plan to continue.');
      return;
    }

    setIsGenerating(true);
    try {
      await incrementUsage('aiQueries');
      const code = await generatePandasCode(userPrompt, dataDescription);
      setGeneratedCode(code);
      
      if (onCodeGenerate) {
        onCodeGenerate(code, userPrompt);
      }
    } catch (error) {
      console.error('Pandas code generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateCode(prompt);
  };

  const useExample = (example) => {
    setPrompt(example);
    generateCode(example);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiLock} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upgrade Required
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          AI Pandas Editor requires a Business plan or higher.
        </p>
        <button 
          onClick={() => window.location.href = '/pricing'}
          className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiDatabase} className="w-5 h-5 text-purple-500" />
          <span>AI Pandas Code Generator</span>
        </h3>

        {/* Data Description */}
        {dataDescription && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Data:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{dataDescription}</p>
          </div>
        )}

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your data analysis task:
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a pivot table showing sales by product category and month"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiZap} className="w-4 h-4" />
                    <span>Generate Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Example Prompts */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example tasks:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => useExample(example)}
                disabled={isGenerating}
                className="text-left p-2 text-sm bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Code */}
      {generatedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-green-500" />
              <span>Generated Pandas Code</span>
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyCode}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {generatedCode}
            </pre>
          </div>

          {/* Code Explanation */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">How to use this code:</h5>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Make sure your DataFrame is named 'df'</li>
              <li>• Install required packages: pandas, matplotlib, seaborn</li>
              <li>• Run this code in your Python environment</li>
              <li>• Modify column names to match your actual data</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-dark-700 text-center">
          <SafeIcon icon={FiTable} className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">Data Exploration</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Basic statistics and data overview</p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-dark-700 text-center">
          <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">Visualization</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Charts and graphs generation</p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-dark-700 text-center">
          <SafeIcon icon={FiZap} className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">Advanced Analysis</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">Statistical analysis and modeling</p>
        </div>
      </div>
    </div>
  );
};

export default PandasEditor;