import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiLink, FiTarget, FiTrendingUp, FiMail, FiExternalLink, FiDollarSign, FiUsers, FiCalendar } = FiIcons;

const BacklinkGenerator = () => {
  const [keywords, setKeywords] = useState('');
  const [industry, setIndustry] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [outreachTemplates, setOutreachTemplates] = useState([]);

  const analyzeBacklinkOpportunities = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockOpportunities = [
      {
        id: 1,
        domain: 'techcrunch.com',
        domainAuthority: 92,
        relevanceScore: 95,
        type: 'Guest Post',
        difficulty: 'High',
        estimatedCost: '$500-$1000',
        contactEmail: 'editor@techcrunch.com',
        notes: 'Major tech publication, accepts guest posts about AI and data analytics',
        potentialTraffic: '50K+ monthly visitors',
        strategy: 'Pitch a comprehensive guide on "The Future of AI in Business Analytics"'
      },
      {
        id: 2,
        domain: 'datacamp.com',
        domainAuthority: 78,
        relevanceScore: 98,
        type: 'Resource Link',
        difficulty: 'Medium',
        estimatedCost: 'Free',
        contactEmail: 'partnerships@datacamp.com',
        notes: 'Educational platform for data science, maintains resource directories',
        potentialTraffic: '25K+ monthly visitors',
        strategy: 'Submit your platform to their data analytics tools directory'
      },
      {
        id: 3,
        domain: 'kdnuggets.com',
        domainAuthority: 71,
        relevanceScore: 96,
        type: 'Article Mention',
        difficulty: 'Medium',
        estimatedCost: 'Free',
        contactEmail: 'editor@kdnuggets.com',
        notes: 'Leading data science publication, regularly features new tools',
        potentialTraffic: '30K+ monthly visitors',
        strategy: 'Pitch a case study on "How AI-Powered Analytics Transformed Business Decision Making"'
      },
      {
        id: 4,
        domain: 'producthunt.com',
        domainAuthority: 85,
        relevanceScore: 88,
        type: 'Product Launch',
        difficulty: 'Low',
        estimatedCost: 'Free',
        contactEmail: 'hello@producthunt.com',
        notes: 'Perfect platform for launching new features or major updates',
        potentialTraffic: '15K+ potential reach',
        strategy: 'Launch your AI SEO feature as a product update'
      },
      {
        id: 5,
        domain: 'towards-data-science.com',
        domainAuthority: 76,
        relevanceScore: 94,
        type: 'Guest Article',
        difficulty: 'Medium',
        estimatedCost: 'Free',
        contactEmail: 'submissions@towardsdatascience.com',
        notes: 'Medium publication focused on data science and AI',
        potentialTraffic: '40K+ monthly readers',
        strategy: 'Write a technical deep-dive on "Building Conversational AI for Data Analytics"'
      }
    ];

    const templates = [
      {
        id: 1,
        type: 'Guest Post Pitch',
        subject: 'Guest Post Proposal: AI Analytics Insights for [Publication Name]',
        template: `Hi [Editor Name],

I hope this email finds you well. I'm [Your Name] from Datafy, an AI-powered data analytics platform that's helping businesses transform raw data into actionable insights.

I've been following [Publication Name] and really admire your coverage of [specific recent article]. Your audience would benefit from insights on how AI is revolutionizing data analytics.

I'd love to contribute a guest post on "[Proposed Topic]" which would cover:
• How conversational AI is making data analysis accessible to non-technical users
• Real-world case studies of AI-driven business transformations
• Future trends in AI-powered analytics

I have [X years] of experience in [relevant field] and have been featured in [mention any credible publications].

Would this be of interest to your readers? I'm happy to provide a detailed outline or writing samples.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`
      },
      {
        id: 2,
        type: 'Resource Inclusion',
        subject: 'Resource Suggestion: AI Analytics Platform for Your Directory',
        template: `Hello [Contact Name],

I came across your excellent resource page on [specific page] and noticed you feature high-quality data analytics tools.

I'd like to suggest including Datafy, our AI-powered analytics platform that allows users to analyze data through natural language conversations. It's particularly valuable because:

• No-code solution for complex data analysis
• AI-powered insights and visualizations
• Supports 50+ data source integrations
• Used by [number] companies worldwide

Here's a brief description you could use:
"Datafy - AI-powered analytics platform that transforms data analysis through conversational AI. Perfect for teams who need powerful insights without technical complexity."

Link: [Your URL]

Would this be a valuable addition to your resource page?

Thank you for maintaining such a helpful resource!

Best,
[Your Name]`
      },
      {
        id: 3,
        type: 'Broken Link Outreach',
        subject: 'Broken Link on [Page Title] - Helpful Replacement Suggestion',
        template: `Hi [Contact Name],

I was researching [topic] and came across your fantastic article on [article title]. It's incredibly comprehensive and valuable!

While reading through it, I noticed that one of your links (to [broken URL]) appears to be broken and returns a 404 error.

I actually have a resource that might be an even better fit for your readers: [Your URL]

It covers [brief description of how it relates to their content] and provides [specific value proposition].

No worries if it's not a good fit - just thought I'd let you know about the broken link either way!

Best regards,
[Your Name]
[Your Title]
[Company]`
      }
    ];

    setOpportunities(mockOpportunities);
    setOutreachTemplates(templates);
    setAnalyzing(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const copyTemplate = (template) => {
    navigator.clipboard.writeText(template);
    // Could add toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Backlink Opportunity Finder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiTarget} className="w-5 h-5 text-primary-500" />
          <span>AI Backlink Opportunity Finder</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., AI analytics, data visualization, business intelligence"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry/Niche
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="data-science">Data Science</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>
        <button
          onClick={analyzeBacklinkOpportunities}
          disabled={!keywords || !industry || analyzing}
          className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Finding Opportunities...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiLink} className="w-4 h-4" />
              <span>Find Backlink Opportunities</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Backlink Opportunities */}
      {opportunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            White-Hat Backlink Opportunities
          </h3>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{opportunity.domain}</h4>
                      <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                        DA: {opportunity.domainAuthority}
                      </span>
                      <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                        {opportunity.relevanceScore}% relevant
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(opportunity.difficulty)}`}>
                        {opportunity.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{opportunity.notes}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiDollarSign} className="w-3 h-3" />
                        <span>{opportunity.estimatedCost}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUsers} className="w-3 h-3" />
                        <span>{opportunity.potentialTraffic}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiTarget} className="w-3 h-3" />
                        <span>{opportunity.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button className="bg-primary-500 text-white px-3 py-1 rounded text-xs hover:bg-primary-600 transition-colors duration-200">
                      Contact
                    </button>
                    <button className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200">
                      Save
                    </button>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Recommended Strategy:</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{opportunity.strategy}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Outreach Templates */}
      {outreachTemplates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiMail} className="w-5 h-5 text-secondary-400" />
            <span>AI-Generated Outreach Templates</span>
          </h3>
          <div className="space-y-6">
            {outreachTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 dark:border-dark-600 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-600">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{template.type}</h4>
                  <button
                    onClick={() => copyTemplate(template.template)}
                    className="bg-secondary-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-500 transition-colors duration-200"
                  >
                    Copy Template
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject Line:</p>
                  <p className="text-sm bg-gray-50 dark:bg-dark-700 p-2 rounded mb-4">{template.subject}</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Template:</p>
                  <pre className="text-xs bg-gray-50 dark:bg-dark-700 p-4 rounded whitespace-pre-wrap overflow-auto max-h-60">
                    {template.template}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Backlink Tracking Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-500" />
          <span>Backlink Campaign Tracking</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Opportunities Found</p>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Outreach Sent</p>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Links Acquired</p>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">37.5%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Recent Campaign Activity</h4>
          {[
            { action: 'Backlink acquired from KDNuggets.com', status: 'success', time: '2 hours ago' },
            { action: 'Outreach email sent to TechCrunch editor', status: 'pending', time: '1 day ago' },
            { action: 'Guest post published on DataCamp', status: 'success', time: '3 days ago' },
            { action: 'Follow-up email sent to Towards Data Science', status: 'pending', time: '5 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BacklinkGenerator;