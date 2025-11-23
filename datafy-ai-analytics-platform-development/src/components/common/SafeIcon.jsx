import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const SafeIcon = ({ icon: IconComponent, name, className = '', ...props }) => {
  // Handle the case where icon is passed directly
  if (IconComponent && typeof IconComponent === 'function') {
    try {
      return <IconComponent className={className} {...props} />;
    } catch (error) {
      console.warn('Error rendering icon:', error);
      return <FiAlertTriangle className={className} {...props} />;
    }
  }

  // Handle the case where name is passed (fallback)
  if (name) {
    try {
      // This is a simplified fallback - in a real app you'd import the icon dynamically
      return <FiAlertTriangle className={className} {...props} />;
    } catch (error) {
      console.warn('Error rendering named icon:', error);
      return <FiAlertTriangle className={className} {...props} />;
    }
  }

  // Default fallback
  return <FiAlertTriangle className={className} {...props} />;
};

export default SafeIcon;