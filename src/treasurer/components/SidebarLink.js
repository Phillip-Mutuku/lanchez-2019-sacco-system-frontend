import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarLink = ({ icon, title, active, onClick, collapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-purple-100 text-purple-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <FontAwesomeIcon icon={icon} className={`text-lg ${active ? 'text-purple-600' : 'text-gray-400'}`} />
      {!collapsed && (
        <span className="ml-3 font-medium">{title}</span>
      )}
    </button>
  );
};

export default SidebarLink;