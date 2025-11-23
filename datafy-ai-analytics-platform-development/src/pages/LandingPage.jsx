import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiMessageCircle, FiDatabase, FiTrendingUp, FiShield, FiZap, FiUsers, FiArrowRight, FiUpload, FiEye, FiDownload } = FiIcons;

const features = [
  {
    icon: FiMessageCircle,
    title: 'Conversational Analytics',
    description: 'Ask questions in plain English and get instant insights from your data.',
  },
  {
    icon: FiDatabase,
    title: 'Universal Data Connectors',
    description: 'Connect to 50+ data sources including SQL, CSV, APIs, and cloud platforms.',
  },
  {
    icon: FiTrendingUp,
    title: 'Predictive Intelligence',
    description: 'AI-powered forecasting and trend analysis to predict future outcomes.',
  },
  {
    icon: FiShield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with role-based access and data encryption.',
  },
  {
    icon: FiZap,
    title: 'Real-time Processing',
    description: 'Process and analyze data in real-time with lightning-fast performance.',
  },
  {
    icon: FiUsers,
    title: 'Team Collaboration',
    description: 'Share insights, collaborate on reports, and work together seamlessly.',
  },
];

const howItWorksSteps = [
  {
    icon: FiUpload,
    title: 'Connect Your Data',
    description: 'Easily upload files or connect to databases and cloud storage like AWS S3, BigQuery, and more.',
    color: 'bg-primary-500',
  },
  {
    icon: FiMessageCircle,
    title: 'Chat to Analyze',
    description: 'Use plain English to ask complex questions, clean data, and get instant insights from our AI.',
    color: 'bg-secondary-400',
  },
  {
    icon: FiEye,
    title: 'Visualize & Report',
    description: 'Automatically generate stunning charts, dashboards, and exportable reports in seconds.',
    color: 'bg-purple-500',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-calibri-bold text-gray-900 dark:text-white mb-6">
              <span className="font-black">Chat with your data.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400 font-black">
                Get instant insights.
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto font-calibri">
              Transform your data into actionable insights with our next-generation AI analytics platform. 
              Ask questions in plain English, get instant, intelligent answers and make smarter decisions—no code required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-8 py-4 rounded-lg font-calibri-bold text-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </Link>
              <Link
                to="/features"
                className="border-2 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-calibri-bold text-lg hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-200"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-calibri-bold text-gray-900 dark:text-white mb-4">
              How it Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              Three simple steps to unlock the power of your data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <SafeIcon icon={step.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Conversational AI Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-500 to-secondary-400 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <h3 className="text-3xl font-calibri-bold mb-4">
              Unlock the power of conversational AI for analytics
            </h3>
            <p className="text-xl mb-8 max-w-4xl mx-auto font-calibri opacity-90">
              Go beyond traditional dashboards. Ask questions in your own words, merge complex datasets 
              with a single command, and let our AI do the heavy lifting. From data cleaning to predictive 
              forecasting, it's all just a conversation away.
            </p>
            <Link
              to="/features"
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-calibri-bold transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Explore Features</span>
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-calibri-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Analytics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              Everything you need to turn your data into competitive advantage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 p-8 rounded-xl hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center mb-4">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-calibri-bold text-white mb-4">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-calibri">
              Join thousands of companies already using Datafy to make data-driven decisions
            </p>
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-calibri-bold text-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;