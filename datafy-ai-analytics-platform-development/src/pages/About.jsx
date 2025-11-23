import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiUsers, FiTrendingUp, FiArrowRight, FiHeart, FiZap, FiShield } = FiIcons;

const values = [
  {
    icon: FiTarget,
    title: 'Democratizing Data',
    description: 'Empowering every team member to be a data analyst.',
    color: 'bg-blue-500',
  },
  {
    icon: FiZap,
    title: 'Accelerating Insights',
    description: 'Get answers in minutes, not days.',
    color: 'bg-yellow-500',
  },
  {
    icon: FiUsers,
    title: 'Fostering Collaboration',
    description: 'Share discoveries and build data-driven cultures.',
    color: 'bg-green-500',
  },
];

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-founder',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
    description: 'Former data scientist at Google with 10+ years in AI and machine learning.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO & Co-founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: 'Ex-engineering lead at Microsoft, expert in scalable data infrastructure.',
  },
  {
    name: 'Emily Johnson',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    description: 'Product strategist with experience at Tableau and Snowflake.',
  },
];

const About = () => {
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
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">Datafy</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-calibri">
              We're on a mission to make data analytics accessible, intuitive, and powerful for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-calibri leading-relaxed">
                We believe that data holds the key to solving the world's most complex problems. 
                Our mission is to make data analytics accessible, intuitive, and powerful for 
                everyone—regardless of their technical expertise.
              </p>
              <Link
                to="/features"
                className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-lg font-calibri-bold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Explore Our Platform</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Team collaboration with data visualizations"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-400/20 rounded-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* From Complex to Conversational */}
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
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                alt="AI and data analysis visualization"
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
                From Complex to Conversational
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-calibri leading-relaxed">
                Datafys was born from a simple idea: what if you could just talk to your data? 
                We've replaced complex dashboards and steep learning curves with a natural, 
                conversational interface. By leveraging the power of advanced AI models like GPT-4, 
                we translate your questions into powerful queries, transforming raw data into clear, 
                actionable insights in seconds.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <SafeIcon icon={value.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-calibri">
              Passionate experts dedicated to democratizing data analytics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-calibri-bold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-calibri text-sm">
                  {member.description}
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
              Join Us in Revolutionizing Data Analytics
            </h2>
            <p className="text-xl text-white/90 mb-8 font-calibri">
              Ready to experience the future of data analysis? Start your journey today.
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
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;