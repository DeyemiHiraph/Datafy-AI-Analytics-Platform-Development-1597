import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Features from './pages/Features';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// User pages
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import DataSources from './pages/DataSources';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AIWorkspace from './pages/AIWorkspace';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentManagement from './pages/admin/ContentManagement';
import BillingManagement from './pages/admin/BillingManagement';
import SEOManagement from './pages/admin/SEOManagement';

// Subscription components
import PricingPlans from './components/subscription/PricingPlans';
import SubscriptionManager from './components/subscription/SubscriptionManager';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AdminAuthProvider>
            <DataProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Admin routes */}
                    <Route path="/poweradmin/login" element={<AdminLogin />} />
                    <Route
                      path="/poweradmin"
                      element={
                        <AdminProtectedRoute>
                          <AdminLayout />
                        </AdminProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/poweradmin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="seo" element={<SEOManagement />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="content" element={<ContentManagement />} />
                      <Route path="billing" element={<BillingManagement />} />
                      <Route path="settings" element={<AdminDashboard />} />
                    </Route>

                    {/* Protected user routes */}
                    <Route
                      path="/app"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/app/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="chat" element={<Chat />} />
                      <Route path="data-sources" element={<DataSources />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="ai-workspace" element={<AIWorkspace />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="subscription" element={<SubscriptionManager />} />
                      <Route path="upgrade" element={<PricingPlans />} />
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        fontSize: '14px',
                      },
                      success: {
                        iconTheme: {
                          primary: '#14b8a6',
                          secondary: '#f8fafc',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#f8fafc',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </DataProvider>
          </AdminAuthProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;