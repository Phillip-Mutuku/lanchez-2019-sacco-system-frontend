import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSearch,
  faBell,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';

const Header = ({
  searchTerm,
  onSearch,
  notifications,
  onNotificationRead,
  onToggleSidebar,
  treasurerInfo,
  onLogout,
  isSearching,
  searchResults,
  onSelectMember,
  onClearSearch
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={onToggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => onSearch(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {searchResults?.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      onSelectMember(member);
                      onClearSearch();
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-500">{member.phoneNumber}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Balance: KES {member.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FontAwesomeIcon icon={faBell} className="text-gray-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => onNotificationRead(notification.id)}
                        className={`p-3 rounded-lg cursor-pointer ${
                          notification.read ? 'bg-gray-50' : 'bg-blue-50'
                        } hover:bg-opacity-80 transition-colors`}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserCircle} className="text-purple-600" />
              </div>
              <span className="font-medium">{treasurerInfo?.name || 'Treasurer'}</span>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Help & Support
                  </button>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;