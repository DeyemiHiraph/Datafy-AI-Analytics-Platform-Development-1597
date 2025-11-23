import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle, FiUsers, FiHelpCircle, FiSettings } = FiIcons;

const contactMethods = [
  {
    icon: FiMail,
    title: 'Email Us',
    description: 'Get in touch with our team',
    contact: 'hello@datafy.com',
    action: 'mailto:hello@datafy.com'
  },
  {
    icon: FiPhone,
    title: 'Call Us',
    description: 'Speak with our experts',
    contact: '+1 (555) 123-4567',
    action: 'tel:+15551234567'
  },
  {
    icon: FiMapPin,
    title: 'Visit Us',
    description: 'Come to our office',
    contact: '123 Data Street, San Francisco, CA 94105',
    action: 'https://maps.google.com'
  }
];

const inquiryTypes = [
  { icon: FiMessageCircle, title: 'General Inquiry', description: 'Questions about our platform' },
  { icon: FiUsers, title: 'Sales', description: 'Pricing and enterprise solutions' },
  { icon: FiHelpCircle, title: 'Support', description: 'Technical help and assistance' },
  { icon: FiSettings, title: 'Partnership', description: 'Business partnerships and integrations' }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

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
              Get in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-calibri">
              Have questions about Datafys? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : '_self'}
                rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-xl hover:shadow-lg transition-all duration-200 bg-gray-50 dark:bg-dark-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={method.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri mb-3">
                  {method.description}
                </p>
                <p className="text-primary-600 dark:text-primary-400 font-calibri-bold">
                  {method.contact}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-calibri-bold text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-calibri-bold text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-calibri-bold text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-calibri-bold text-gray-700 dark:text-gray-300 mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    name="inquiryType"
                    required
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-calibri-bold text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-lg font-calibri-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </motion.div>

            {/* Inquiry Types */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-calibri-bold text-gray-900 dark:text-white mb-8">
                How can we help?
              </h3>
              
              {inquiryTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SafeIcon icon={type.icon} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-calibri-bold text-gray-900 dark:text-white mb-2">
                        {type.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 font-calibri">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Office Hours */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-400 p-6 rounded-xl text-white">
                <h4 className="text-lg font-calibri-bold mb-3">
                  Office Hours
                </h4>
                <div className="space-y-2 text-sm font-calibri">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 2:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-calibri">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'How quickly will I receive a response?',
                answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent support issues, we aim to respond within 4 hours.'
              },
              {
                question: 'Do you offer custom enterprise solutions?',
                answer: 'Yes, we provide custom solutions for enterprise clients including on-premise deployments, custom integrations, and dedicated support.'
              },
              {
                question: 'Can I schedule a demo?',
                answer: 'Absolutely! Contact our sales team to schedule a personalized demo of the Datafys platform tailored to your specific use case.'
              },
              {
                question: 'What support channels are available?',
                answer: 'We offer support through email, phone, live chat, and our comprehensive help center with documentation and tutorials.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-dark-700 p-6 rounded-xl"
              >
                <h3 className="text-lg font-calibri-bold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-calibri">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;