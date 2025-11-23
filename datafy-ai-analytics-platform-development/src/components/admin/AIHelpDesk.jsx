import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiBot, FiSend, FiZap, FiRefreshCw, FiAlertCircle, FiCheckCircle } = FiIcons;

const AIHelpDesk = () => {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickFixes, setQuickFixes] = useState([]);

  // Mock AI responses - replace with real OpenAI integration
  const generateAIResponse = async (userQuery) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResponses = {
      'server error': {
        analysis: 'Detected potential database connection timeout. Server load is at 85%.',
        suggestions: [
          'Restart database connection pool',
          'Clear Redis cache',
          'Scale up server resources'
        ],
        quickFixes: [
          { action: 'restart_db_pool', label: 'Restart DB Pool', risk: 'low' },
          { action: 'clear_cache', label: 'Clear Cache', risk: 'low' },
          { action: 'scale_server', label: 'Auto-Scale Server', risk: 'medium' }
        ]
      },
      'user issue': {
        analysis: 'Multiple users reporting dashboard loading issues. Likely frontend cache problem.',
        suggestions: [
          'Clear CDN cache',
          'Force refresh user sessions',
          'Check API response times'
        ],
        quickFixes: [
          { action: 'clear_cdn', label: 'Clear CDN Cache', risk: 'low' },
          { action: 'refresh_sessions', label: 'Refresh User Sessions', risk: 'medium' }
        ]
      },
      'billing error': {
        analysis: 'Stripe webhook delivery failing. Payment processing may be affected.',
        suggestions: [
          'Check Stripe webhook endpoints',
          'Verify SSL certificates',
          'Review recent payment failures'
        ],
        quickFixes: [
          { action: 'test_webhooks', label: 'Test Webhooks', risk: 'low' },
          { action: 'retry_failed_payments', label: 'Retry Failed Payments', risk: 'high' }
        ]
      }
    };

    const key = Object.keys(mockResponses).find(k => userQuery.toLowerCase().includes(k));
    const response = mockResponses[key] || {
      analysis: 'AI analysis complete. No critical issues detected.',
      suggestions: ['Monitor system metrics', 'Review error logs'],
      quickFixes: []
    };

    setInsights(prev => [...prev, {
      id: Date.now(),
      query: userQuery,
      timestamp: new Date(),
      ...response
    }]);

    setQuickFixes(response.quickFixes);
    setLoading(false);
  };

  const executeQuickFix = async (action) => {
    setLoading(true);
    
    // Simulate quick fix execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInsights(prev => [...prev, {
      id: Date.now(),
      type: 'fix_result',
      action,
      result: 'Quick fix executed successfully',
      timestamp: new Date()
    }]);
    
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    generateAIResponse(query);
    setQuery('');
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <SafeIcon icon={FiBot} className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Help Desk Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Intelligent backend diagnostics and automated fixes
          </p>
        </div>
      </div>

      {/* Query Input */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe the issue or ask for system diagnostics
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'Users reporting server errors' or 'Check billing system status'"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                )}
                <span>Analyze</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => generateAIResponse('server error diagnostics')}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
          >
            Server Health Check
          </button>
          <button
            onClick={() => generateAIResponse('user issue analysis')}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
          >
            User Issues Analysis
          </button>
          <button
            onClick={() => generateAIResponse('billing error check')}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
          >
            Billing System Check
          </button>
        </div>
      </div>

      {/* Quick Fixes */}
      {quickFixes.length > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiZap} className="w-5 h-5 text-yellow-500" />
            <span>Suggested Quick Fixes</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickFixes.map((fix, index) => (
              <button
                key={index}
                onClick={() => executeQuickFix(fix.action)}
                disabled={loading}
                className={`p-4 rounded-lg border-2 text-left hover:shadow-md transition-all duration-200 disabled:opacity-50 ${getRiskColor(fix.risk)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">{fix.risk} Risk</span>
                </div>
                <p className="font-medium">{fix.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            {insight.type === 'fix_result' ? (
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Quick Fix Executed: {insight.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {insight.result}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {insight.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <SafeIcon icon={FiBot} className="w-5 h-5 text-purple-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Query: {insight.query}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {insight.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2 flex items-center space-x-2">
                    <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                    <span>AI Analysis</span>
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    {insight.analysis}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                    Recommendations:
                  </h5>
                  <ul className="space-y-1">
                    {insight.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIHelpDesk;