import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiArrowRight, FiSearch, FiTag } = FiIcons;

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with AI-Powered Data Analytics',
    excerpt: 'Learn how to leverage artificial intelligence to unlock insights from your data without any technical expertise.',
    content: 'Full article content would go here...',
    author: 'Sarah Chen',
    date: '2024-01-15',
    category: 'Tutorial',
    tags: ['AI', 'Analytics', 'Getting Started'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    featured: true
  },
  {
    id: 2,
    title: 'The Future of Conversational Analytics',
    excerpt: 'Explore how natural language processing is revolutionizing the way we interact with data.',
    content: 'Full article content would go here...',
    author: 'Michael Rodriguez',
    date: '2024-01-12',
    category: 'Industry Insights',
    tags: ['Future', 'NLP', 'Trends'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Data Visualization Best Practices',
    excerpt: 'Discover the key principles for creating compelling and effective data visualizations.',
    content: 'Full article content would go here...',
    author: 'Emily Johnson',
    date: '2024-01-10',
    category: 'Best Practices',
    tags: ['Visualization', 'Design', 'Charts'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Building a Data-Driven Culture',
    excerpt: 'Learn how to foster data literacy and analytical thinking across your organization.',
    content: 'Full article content would go here...',
    author: 'David Kim',
    date: '2024-01-08',
    category: 'Strategy',
    tags: ['Culture', 'Leadership', 'Organization'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
  },
  {
    id: 5,
    title: 'Predictive Analytics for Business Growth',
    excerpt: 'Understand how predictive models can help you anticipate trends and make proactive decisions.',
    content: 'Full article content would go here...',
    author: 'Lisa Wang',
    date: '2024-01-05',
    category: 'Advanced',
    tags: ['Predictive', 'Machine Learning', 'Business'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Data Security in Cloud Analytics',
    excerpt: 'Essential security considerations when moving your analytics to the cloud.',
    content: 'Full article content would go here...',
    author: 'Alex Thompson',
    date: '2024-01-03',
    category: 'Security',
    tags: ['Security', 'Cloud', 'Privacy'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop'
  }
];

const categories = ['All', 'Tutorial', 'Industry Insights', 'Best Practices', 'Strategy', 'Advanced', 'Security'];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const recentPosts = filteredPosts.filter(post => !post.featured).slice(0, 5);

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
              The Datafys
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-calibri">
              Insights, tutorials, and best practices for modern data analytics
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-calibri text-sm transition-colors duration-200 ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12 bg-white dark:bg-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-calibri-bold">
                    Featured
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 font-calibri text-sm">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-calibri leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span className="font-calibri text-sm">{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span className="font-calibri text-sm">
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-lg font-calibri-bold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <span>Read Article</span>
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="rounded-xl shadow-lg w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-400/20 rounded-xl"></div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-calibri-bold text-gray-900 dark:text-white mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-calibri">
              Stay updated with the latest trends and insights in data analytics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-dark-800/90 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-calibri-bold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-calibri-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-calibri mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <SafeIcon icon={FiUser} className="w-4 h-4" />
                      <span className="font-calibri text-sm">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span className="font-calibri text-sm">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-calibri"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary-600 dark:text-primary-400 font-calibri-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 inline-flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-8 py-3 rounded-lg font-calibri-bold hover:shadow-lg transition-all duration-200">
              Load More Articles
            </button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-calibri-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 font-calibri">
              Get the latest insights and tutorials delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg font-calibri focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-calibri-bold transition-all duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;