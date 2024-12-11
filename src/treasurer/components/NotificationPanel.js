import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';

const NotificationPanel = ({ notifications, onClose, onNotificationRead }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faBell} className="text-purple-600" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-purple-50' : ''
              }`}
              onClick={() => onNotificationRead(notification.id)}
            >
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;