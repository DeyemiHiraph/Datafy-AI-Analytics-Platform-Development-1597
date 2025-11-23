import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDatabase, FiMessageCircle, FiZap, FiFilter, FiBarChart3, FiTrendingUp, FiUsers, FiDownload, FiShield, FiArrowRight } = FiIcons;

const features = [
  {
    icon: FiDatabase,
    title: 'Data Source Integration',
    description: 'Upload files (CSV, Excel, PDF) or connect to databases like MySQL, PostgreSQL, and cloud storage like S3.',
    color: 'bg-blue-500',
  },
  {
    icon: FiMessageCircle,
    title: 'Conversational AI Interface',
    description: 'Ask questions in plain English. Our AI understands context and provides answers, charts, and insights.',
    color: 'bg-green-500',
  },
  {
    icon: FiZap,
    title: 'Smart Query Engine',
    description: 'Our GPT-powered engine translates your natural language prompts into executable SQL or Pandas code.',
    color: 'bg-yellow-500',
  },
  {
    icon: FiFilter,
    title: 'Data Transformation & Cleaning',
    description: 'Filter, sort, group, join, and clean your data with simple chat commands. No more manual data wrangling.',
    color: 'bg-purple-500',
  },
  {
    icon: FiBarChart3,
    title: 'Automated Dashboards',
    description: 'Instantly generate bar charts, pie charts, line graphs, and more. Switch between chat and dashboard views.',
    color: 'bg-indigo-500',
  },
  {
    icon: FiTrendingUp,
    title: 'Predictive Analytics',
    description: 'Run forecasts, trend predictions, and customer segmentation using built-in machine learning models.',
    color: 'bg-red-500',
  },
  {
    icon: FiUsers,
    title: 'Team Collaboration',
    description: 'Share projects, leave comments, and manage permissions with view-only or editing access for your team.',
    color: 'bg-teal-500',
  },
  {
    icon: FiDownload,
    title: 'Exporting & Sharing',
    description: 'Export insights and charts as PDF, PNG, or CSV. Share dashboards via secure links or embeddable iframes.',
    color: 'bg-orange-500',
  },
  {
    icon: FiShield,
    title: 'Secure & Reliable',
    description: 'Your data is protected with role-based access, 2FA, and session-level isolation for complete security.',
    color: 'bg-pink-500',
  },
];

const integrations = [
  { name: 'MySQL', logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop' },
  { name: 'PostgreSQL', logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop' },
  { name: 'AWS S3', logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop' },
  { name: 'Google BigQuery', logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop' },
  { name: 'Snowflake', logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop' },
  { name: 'MongoDB', logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop' },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-calibri-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">
                Analyze Data
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-calibri">
              Datafys combines powerful, enterprise-grade features with an incredibly simple, conversational interface.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-dark-700 p-8 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Analytics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-6">
                AI-Powered Analytics at Your Fingertips
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-calibri leading-relaxed">
                Our advanced AI engine understands your questions and automatically generates the right 
                visualizations, performs complex calculations, and provides intelligent insights. No SQL 
                knowledge required – just ask and get answers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">Natural language processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">Context-aware responses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">Automated insight generation</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                alt="AI-powered data analysis"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-400/20 rounded-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-4">
              Connect to Your Favorite Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              Seamlessly integrate with 50+ data sources and platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <SafeIcon icon={FiDatabase} className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                </div>
                <p className="text-sm font-calibri text-gray-600 dark:text-gray-300">
                  {integration.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop"
                alt="Security and privacy"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary-400/20 to-primary-500/20 rounded-xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-calibri leading-relaxed">
                Your data security is our top priority. We implement industry-leading security measures 
                to protect your sensitive information and ensure compliance with global standards.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">SOC 2 Type II compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">Role-based access controls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-calibri">GDPR & CCPA compliant</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-calibri-bold text-white mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-calibri">
              Start analyzing your data with AI-powered insights today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-calibri-bold hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-calibri-bold transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;