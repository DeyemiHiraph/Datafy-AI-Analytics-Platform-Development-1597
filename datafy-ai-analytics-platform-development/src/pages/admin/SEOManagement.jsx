import React from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import SEODashboard from '../../components/admin/SEODashboard';

const SEOManagement = () => {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission('seo.manage')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage SEO.</p>
      </div>
    );
  }

  return <SEODashboard />;
};

export default SEOManagement;