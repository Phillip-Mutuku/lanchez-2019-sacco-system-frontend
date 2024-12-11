import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faHistory,
  faFileAlt,
  faUserPlus,
  faCog,
  faSignOutAlt,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ 
  isOpen, 
  isCollapsed, 
  activeTab, 
  onTabChange, 
  onCollapse, 
  onLogout 
}) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-blue-700 to-purple-800 text-white transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-64'
    } ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold">L</span>
          </div>
          <span className="font-bold text-lg">Lanchez 2019</span>
        </div>
        <button 
          onClick={onCollapse}
          className="lg:block hidden hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 px-4">
        <SidebarLink
          icon={faHome}
          text="Overview"
          active={activeTab === 'overview'}
          collapsed={isCollapsed}
          onClick={() => onTabChange('overview')}
        />
        <SidebarLink
          icon={faUsers}
          text="Members"
          active={activeTab === 'members'}
          collapsed={isCollapsed}
          onClick={() => onTabChange('members')}
        />
        <SidebarLink
          icon={faHistory}
          text="Transactions"
          active={activeTab === 'transactions'}
          collapsed={isCollapsed}
          onClick={() => onTabChange('transactions')}
        />
        <SidebarLink
          icon={faFileAlt}
          text="Reports"
          active={activeTab === 'reports'}
          collapsed={isCollapsed}
          onClick={() => onTabChange('reports')}
        />
        <SidebarLink
          icon={faUserPlus}
          text="Registration"
          active={activeTab === 'registration'}
          collapsed={isCollapsed}
          onClick={() => onTabChange('registration')}
        />
      </nav>

      {/* Bottom Links */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <SidebarLink
          icon={faCog}
          text="Settings"
          active={activeTab === 'settings'}
          collapsed={isCollapsed}
          onClick={() => onTabChange('settings')}
        />
        <SidebarLink
          icon={faSignOutAlt}
          text="Logout"
          collapsed={isCollapsed}
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, text, active, collapsed, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-white/10 text-white' 
        : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`}
  >
    <FontAwesomeIcon icon={icon} className={`text-lg ${collapsed ? 'mx-auto' : 'mr-3'}`} />
    {!collapsed && <span className="text-sm">{text}</span>}
  </button>
);


export default Sidebar;