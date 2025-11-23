import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiBarChart3, FiFilter, FiTrendingUp, FiShield, FiUsers, FiSettings, FiBook, FiArrowRight, FiCheck } = FiIcons;

const services = [
  {
    title: 'Self-Service Analytics Platform',
    description: 'Our core offering. An intuitive, chat-based platform for all your data analysis needs. Get started for free or choose a plan that scales with you.',
    icon: FiMessageCircle,
    color: 'bg-primary-500',
    features: [
      'AI-powered chat interface',
      'Automated visualizations',
      'No-code data transformation',
      'Predictive modelling'
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup'
  },
  {
    title: 'Enterprise Solutions',
    description: 'Custom solutions for large organizations. Get dedicated support, advanced security features, and custom integrations to fit your existing workflows.',
    icon: FiShield,
    color: 'bg-purple-500',
    features: [
      'On-premise deployment options',
      'Custom branding',
      'Dedicated account manager',
      'API access for custom integrations'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact'
  },
  {
    title: 'Onboarding & Training',
    description: 'We help your team get the most out of Datafys. Our experts provide hands-on training sessions and workshops tailored to your specific use cases.',
    icon: FiBook,
    color: 'bg-secondary-400',
    features: [
      'Personalized team onboarding',
      'Customized training materials',
      'Best practice workshops',
      'Ongoing support'
    ],
    cta: 'Schedule Training',
    ctaLink: '/contact'
  }
];

const useCases = [
  {
    title: 'Financial Analytics',
    description: 'Track revenue, expenses, and financial KPIs with real-time dashboards.',
    icon: FiTrendingUp,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  },
  {
    title: 'Marketing Intelligence',
    description: 'Analyze campaign performance and customer behavior across all channels.',
    icon: FiBarChart3,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  },
  {
    title: 'Operations Optimization',
    description: 'Streamline processes and identify bottlenecks with operational data.',
    icon: FiSettings,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
  },
  {
    title: 'Customer Analytics',
    description: 'Understand customer journeys and improve retention rates.',
    icon: FiUsers,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
  }
];

const Services = () => {
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
              Solutions Tailored for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">
                Your Success
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-calibri">
              Whether you're a small team or a large enterprise, we have a solution to help you unlock the value in your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-dark-700 p-8 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-6`}>
                  <SafeIcon icon={service.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-calibri">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to={service.ctaLink}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-calibri-bold transition-all duration-200 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-400 text-white hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-dark-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-dark-500'
                  }`}
                >
                  <span>{service.cta}</span>
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-4">
              Popular Use Cases
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              See how teams across industries use Datafys to drive better decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="relative h-48">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <SafeIcon icon={useCase.icon} className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-calibri">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our Implementation Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              We ensure a smooth transition to data-driven decision making
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'We understand your data landscape and business goals.' },
              { step: '02', title: 'Setup', description: 'Configure your platform and connect your data sources.' },
              { step: '03', title: 'Training', description: 'Train your team on best practices and platform features.' },
              { step: '04', title: 'Support', description: 'Ongoing support and optimization for maximum value.' }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-calibri-bold text-lg">{process.step}</span>
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri">
                  {process.description}
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
            <h2 className="text-3xl font-calibri-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-calibri">
              Choose the service that fits your needs and start transforming your data today
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
                to="/contact"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-calibri-bold transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;