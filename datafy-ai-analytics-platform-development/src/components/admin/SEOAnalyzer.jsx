import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiEye, FiImage, FiCode, FiLink2, FiTrendingUp, FiRefreshCw, FiCheckCircle, FiAlertTriangle } = FiIcons;

const SEOAnalyzer = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [optimizations, setOptimizations] = useState([]);

  // Mock AI analysis function
  const analyzePageSEO = async (url) => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockData = {
      url,
      title: {
        current: 'Datafy - AI Analytics Platform',
        optimized: 'AI-Powered Data Analytics Platform | Datafy - Transform Your Data Into Insights',
        score: 65,
        improvements: ['Add high-impact keywords', 'Optimize length (50-60 chars)', 'Include brand name']
      },
      metaDescription: {
        current: 'Transform your data with AI-powered analytics.',
        optimized: 'Unlock powerful insights with Datafy\'s AI-driven analytics platform. Transform raw data into actionable intelligence with natural language queries. Start your free trial today!',
        score: 45,
        improvements: ['Increase to 150-160 characters', 'Add compelling CTA', 'Include target keywords']
      },
      images: [
        {
          src: '/hero-image.jpg',
          currentAlt: '',
          optimizedAlt: 'AI-powered data analytics dashboard showing real-time business insights and interactive charts',
          score: 0
        },
        {
          src: '/features-img.jpg',
          currentAlt: 'Features',
          optimizedAlt: 'Conversational AI interface for data analysis with natural language processing capabilities',
          score: 30
        }
      ],
      schema: {
        hasSchema: false,
        recommended: ['Organization', 'WebSite', 'SoftwareApplication', 'Review'],
        generated: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'Datafy',
          'description': 'AI-powered data analytics platform',
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web Browser'
        }
      },
      internalLinks: [
        { text: 'data visualization tools', targetPage: '/features', relevance: 95 },
        { text: 'AI analytics platform', targetPage: '/about', relevance: 90 },
        { text: 'business intelligence dashboard', targetPage: '/services', relevance: 85 }
      ],
      overallScore: 58
    };

    setSeoData(mockData);
    setAnalyzing(false);
  };

  const applyOptimization = async (type, data) => {
    // Simulate applying optimization
    const newOptimization = {
      id: Date.now(),
      type,
      action: `Applied ${type} optimization`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    setOptimizations(prev => [newOptimization, ...prev]);
  };

  const generateSchema = () => {
    if (seoData?.schema) {
      const schemaScript = `<script type="application/ld+json">
${JSON.stringify(seoData.schema.generated, null, 2)}
</script>`;
      navigator.clipboard.writeText(schemaScript);
      applyOptimization('Schema Markup', seoData.schema.generated);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Analysis Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI SEO Page Analyzer
        </h3>
        <div className="flex space-x-4">
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            placeholder="Enter URL to analyze (e.g., https://yoursite.com/page)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => analyzePageSEO(currentUrl)}
            disabled={!currentUrl || analyzing}
            className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiSearch} className="w-4 h-4" />
                <span>Analyze SEO</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {seoData && (
        <>
          {/* SEO Score Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SEO Score Overview
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                  seoData.overallScore >= 80 ? 'bg-green-100 text-green-600' :
                  seoData.overallScore >= 60 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {seoData.overallScore}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Title Tag</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{seoData.title.score}</p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Meta Description</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{seoData.metaDescription.score}</p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Images</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(seoData.images.reduce((acc, img) => acc + img.score, 0) / seoData.images.length)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Schema</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {seoData.schema.hasSchema ? 100 : 0}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Title Optimization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <SafeIcon icon={FiEye} className="w-5 h-5 text-primary-500" />
                <span>Title Tag Optimization</span>
              </h3>
              <button
                onClick={() => applyOptimization('Title Tag', seoData.title.optimized)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200"
              >
                Apply Optimization
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Title</p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-gray-900 dark:text-white">{seoData.title.current}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Optimized Title</p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-gray-900 dark:text-white">{seoData.title.optimized}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Improvements</p>
                <ul className="space-y-1">
                  {seoData.title.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Meta Description Optimization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <SafeIcon icon={FiSearch} className="w-5 h-5 text-secondary-400" />
                <span>Meta Description Optimization</span>
              </h3>
              <button
                onClick={() => applyOptimization('Meta Description', seoData.metaDescription.optimized)}
                className="bg-secondary-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-500 transition-colors duration-200"
              >
                Apply Optimization
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Meta Description</p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-gray-900 dark:text-white">{seoData.metaDescription.current}</p>
                  <p className="text-xs text-gray-500 mt-1">{seoData.metaDescription.current.length} characters</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Optimized Meta Description</p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-gray-900 dark:text-white">{seoData.metaDescription.optimized}</p>
                  <p className="text-xs text-gray-500 mt-1">{seoData.metaDescription.optimized.length} characters</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Alt Text Optimization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <SafeIcon icon={FiImage} className="w-5 h-5 text-purple-500" />
                <span>AI Image Alt Text Optimization</span>
              </h3>
              <button
                onClick={() => {
                  seoData.images.forEach(img => {
                    applyOptimization('Image Alt Text', img.optimizedAlt);
                  });
                }}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200"
              >
                Optimize All Images
              </button>
            </div>
            <div className="space-y-4">
              {seoData.images.map((image, index) => (
                <div key={index} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{image.src}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      image.score >= 80 ? 'bg-green-100 text-green-800' :
                      image.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Score: {image.score}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Alt Text</p>
                      <p className="text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                        {image.currentAlt || 'No alt text'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">AI Generated Alt Text</p>
                      <p className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                        {image.optimizedAlt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Schema Markup Generation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <SafeIcon icon={FiCode} className="w-5 h-5 text-indigo-500" />
                <span>1-Click Schema Generation</span>
              </h3>
              <button
                onClick={generateSchema}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors duration-200"
              >
                Generate & Copy Schema
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Schema Types</p>
                <div className="flex flex-wrap gap-2">
                  {seoData.schema.recommended.map((type, index) => (
                    <span key={index} className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Schema Markup</p>
                <pre className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(seoData.schema.generated, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Internal Link Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <SafeIcon icon={FiLink2} className="w-5 h-5 text-blue-500" />
                <span>Smart Internal Link Suggestions</span>
              </h3>
              <button
                onClick={() => {
                  seoData.internalLinks.forEach(link => {
                    applyOptimization('Internal Link', link);
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                Apply All Links
              </button>
            </div>
            <div className="space-y-3">
              {seoData.internalLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-600 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">"{link.text}"</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">→ {link.targetPage}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                      {link.relevance}% relevance
                    </span>
                    <button
                      onClick={() => applyOptimization('Internal Link', link)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Recent Optimizations */}
      {optimizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Optimizations
          </h3>
          <div className="space-y-3">
            {optimizations.slice(0, 5).map((optimization) => (
              <div key={optimization.id} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{optimization.action}</p>
                  <p className="text-xs text-gray-500">{new Date(optimization.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SEOAnalyzer;