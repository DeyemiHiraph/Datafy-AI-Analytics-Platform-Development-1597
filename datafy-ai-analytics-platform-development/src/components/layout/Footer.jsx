import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiGithub } = FiIcons;

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const features = [
    { name: 'Conversational AI', href: '/features#ai' },
    { name: 'Data Integration', href: '/features#integration' },
    { name: 'Automated Dashboards', href: '/features#dashboards' },
    { name: 'Predictive Analytics', href: '/features#analytics' },
    { name: 'Team Collaboration', href: '/features#collaboration' },
    { name: 'Enterprise Security', href: '/features#security' },
  ];

  const support = [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Status Page', href: '/status' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751484427009-Datafys_Logo_-_Black_Font_Transparent-removebg-preview%20-%20Copy.png" 
                alt="Datafy Logo" 
                className="h-8 w-auto object-contain filter brightness-0 invert" 
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Transform your data into actionable insights with our AI-powered analytics platform. 
              Ask questions in plain English and get instant, intelligent answers.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <SafeIcon icon={FiMail} className="w-4 h-4" />
                <span>contact@datafy.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <SafeIcon icon={FiPhone} className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature.name}>
                  <Link 
                    to={feature.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {feature.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Datafy. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://twitter.com/datafy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <SafeIcon icon={FiTwitter} className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/company/datafy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <SafeIcon icon={FiLinkedin} className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/datafy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <SafeIcon icon={FiGithub} className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;