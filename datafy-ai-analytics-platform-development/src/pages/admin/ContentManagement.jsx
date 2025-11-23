import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import WYSIWYGEditor from '../../components/admin/WYSIWYGEditor';
import SafeIcon from '../../components/common/SafeIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { 
  FiFileText, FiPlus, FiEdit, FiTrash2, FiEye, FiSave, 
  FiX, FiCalendar, FiUser, FiGlobe, FiEyeOff 
} = FiIcons;

const ContentManagement = () => {
  const { adminUser, hasPermission } = useAdminAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: 'blog',
    tags: ''
  });

  useEffect(() => {
    // Load mock posts data
    const loadPosts = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts = [
        {
          id: '1',
          title: 'Getting Started with AI Analytics',
          excerpt: 'Learn how to leverage AI for powerful data insights...',
          content: '<h2>Introduction</h2><p>AI analytics is revolutionizing...</p>',
          status: 'published',
          category: 'blog',
          author: 'Admin',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          tags: 'AI, Analytics, Tutorial'
        },
        {
          id: '2',
          title: 'New Features in Datafy',
          excerpt: 'Exciting updates and improvements to our platform...',
          content: '<h2>What\'s New</h2><p>We\'re excited to announce...</p>',
          status: 'published',
          category: 'updates',
          author: 'Editor',
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T15:45:00Z',
          tags: 'Updates, Features, Platform'
        },
        {
          id: '3',
          title: 'Data Privacy Best Practices',
          excerpt: 'Essential guidelines for protecting your data...',
          content: '<h2>Privacy First</h2><p>Data privacy is crucial...</p>',
          status: 'draft',
          category: 'guides',
          author: 'Contributor',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
          tags: 'Privacy, Security, Guidelines'
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      category: 'blog',
      tags: ''
    });
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      category: post.category,
      tags: post.tags
    });
    setShowEditor(true);
  };

  const handleSavePost = () => {
    const postData = {
      ...formData,
      id: editingPost?.id || Date.now().toString(),
      author: adminUser.name,
      updatedAt: new Date().toISOString(),
      createdAt: editingPost?.createdAt || new Date().toISOString()
    };

    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? postData : p));
    } else {
      setPosts([postData, ...posts]);
    }

    setShowEditor(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'blog': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'updates': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'guides': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!hasPermission('content.edit') && !hasPermission('content.publish')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage content.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create and manage blog posts, pages, and content
          </p>
        </div>
        {hasPermission('content.edit') && (
          <button 
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Post</span>
          </button>
        )}
      </motion.div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Post Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="blog">Blog</option>
                    <option value="updates">Updates</option>
                    <option value="guides">Guides</option>
                    <option value="help">Help</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="AI, Analytics, Tutorial"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <WYSIWYGEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-4">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Save as Draft</option>
                    {hasPermission('content.publish') && <option value="published">Publish</option>}
                    <option value="archived">Archive</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePost}
                    className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Save Post</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Posts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Posts
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {post.tags && (
                      <div className="flex items-center space-x-1">
                        <span>Tags: {post.tags}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                  >
                    <SafeIcon icon={post.status === 'published' ? FiEye : FiEyeOff} className="w-4 h-4" />
                  </button>
                  {hasPermission('content.edit') && (
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors duration-200"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </button>
                  )}
                  {hasPermission('content.delete') && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContentManagement;