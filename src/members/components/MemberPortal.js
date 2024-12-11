import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWallet, 
  faUsers, 
  faChartLine, 
  faExclamationTriangle,
  faBars,
  faHome,
  faHistory,
  faFileAlt,
  faComments,
  faSignOutAlt,
  faChevronLeft,
  faChevronRight,
  faCog,
  faDownload,
  faBell,
  faSearch,
  faUserCircle,
  faSun,
  faMoon,
  faChevronDown,
  faPrint,
  faCamera,
  faEdit,
  faTimes,
  faCheck,
  faExclamation
} from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MemberPortal = () => {
  // State Management
  const [phoneNumber, setPhoneNumber] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your monthly contribution is due in 3 days",
      time: "2 hours ago",
      read: false,
      type: "warning"
    },
    {
      id: 2,
      message: "Successfully received KES 5,000",
      time: "1 day ago",
      read: true,
      type: "success"
    }
  ]);
  const [transactionFilters, setTransactionFilters] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#2563eb',
    fontSize: 'medium',
    compact: false
  });

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // API Functions
  const searchMember = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/members/${phoneNumber}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch member data');
      }
      
      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.message);
      }
      
      setMemberData(result.data);
      setNewPhoneNumber(result.data.phoneNumber);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching member data');
      console.error('Error fetching member data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Profile Functions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      formData.append('phoneNumber', newPhoneNumber);

      const response = await fetch(`http://localhost:5000/api/members/${memberData.id}/update`, {
        method: 'PUT',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      setMemberData(prev => ({
        ...prev,
        phoneNumber: newPhoneNumber,
        profilePic: result.profilePic
      }));
      setShowEditProfile(false);
      addNotification('Profile updated successfully', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Notification Functions
  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  // Report Generation Functions
  const generateMonthlyStatement = async () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Lanchez 2019 SACCO', 105, 15, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Monthly Statement', 105, 25, { align: 'center' });
      
      // Member Information
      doc.setFontSize(12);
      doc.text([
        `Name: ${memberData.firstName} ${memberData.lastName}`,
        `Position: ${memberData.position}`,
        `Phone Number: ${memberData.phoneNumber}`,
        `Statement Date: ${new Date().toLocaleDateString()}`
      ], 15, 40);

      // Financial Summary
      doc.autoTable({
        startY: 70,
        head: [['Description', 'Amount (KES)']],
        body: [
          ['Opening Balance', memberData.openingBalance?.toLocaleString() || '0'],
          ['Total Contributions', memberData.totalContributions?.toLocaleString() || '0'],
          ['Current Balance', memberData.balance.toLocaleString()]
        ],
        theme: 'grid'
      });

      // Transactions
      doc.text('Recent Transactions', 15, doc.previousAutoTable.finalY + 15);
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 20,
        head: [['Date', 'Type', 'Amount', 'Status']],
        body: memberData.recentTransactions.map(t => [
          t.date,
          t.type,
          `KES ${t.amount.toLocaleString()}`,
          t.status
        ])
      });

      // Footer
      doc.setFontSize(10);
      doc.text('This is a computer-generated document and needs no signature.', 105, 280, { align: 'center' });
      
      doc.save(`${memberData.firstName}_monthly_statement.pdf`);
      addNotification('Monthly statement generated successfully', 'success');
    } catch (error) {
      console.error('Error generating statement:', error);
      addNotification('Failed to generate statement', 'error');
    }
  };

  const generateAnnualReport = async () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Lanchez 2019 SACCO', 105, 15, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Annual Financial Report', 105, 25, { align: 'center' });
      
      // Member Information
      doc.setFontSize(12);
      doc.text([
        `Member: ${memberData.firstName} ${memberData.lastName}`,
        `Position: ${memberData.position}`,
        `Report Period: January - December ${new Date().getFullYear()}`,
        `Generated Date: ${new Date().toLocaleDateString()}`
      ], 15, 40);

      // Annual Summary
      doc.autoTable({
        startY: 70,
        head: [['Category', 'Amount (KES)']],
        body: [
          ['Total Annual Contributions', '120,000'],
          ['Average Monthly Contribution', '10,000'],
          ['Highest Monthly Contribution', '15,000'],
          ['Lowest Monthly Contribution', '5,000'],
          ['Year-End Balance', memberData.balance.toLocaleString()]
        ],
        theme: 'grid'
      });

      doc.save(`${memberData.firstName}_annual_report.pdf`);
      addNotification('Annual report generated successfully', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      addNotification('Failed to generate report', 'error');
    }
  };

  // Theme Functions
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateThemeSettings = (settings) => {
    setThemeSettings(prev => ({
      ...prev,
      ...settings
    }));
  };

  // Handlers
  const handleLogout = () => {
    setMemberData(null);
    setPhoneNumber('');
    setShowProfileMenu(false);
  };

  // Components
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Loading your account...</p>
      </div>
    </div>
  );

  const SidebarLink = ({ icon, text, active, collapsed, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-sm transition-colors ${
        active 
          ? 'bg-white/10 text-white' 
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      <FontAwesomeIcon icon={icon} className={`text-lg ${collapsed ? 'mr-0' : 'mr-3'}`} />
      {!collapsed && <span>{text}</span>}
    </button>
  );

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className={`p-4 md:p-6 rounded-2xl shadow-lg ${color} text-white transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-75">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold mt-2">{value}</h3>
          {subtext && <p className="text-xs mt-2 opacity-75">{subtext}</p>}
        </div>
        <div className="bg-white/20 p-2 md:p-3 rounded-full">
          <FontAwesomeIcon icon={icon} className="text-xl md:text-2xl" />
        </div>
      </div>
    </div>
  );

  // Main Render
  if (!memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lanchez 2019
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Phone Number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 
                dark:bg-gray-700 dark:text-white"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              onClick={searchMember}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl 
              hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Searching...' : 'View Account'}
            </button>
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 rounded">
                <p className="text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-blue-700 to-purple-800 
        transition-all duration-300 transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className={`text-xl font-bold text-white ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>
            Lanchez 2019
          </h2>
          
          {/* Mobile Close Button */}
          <button 
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          {/* Desktop Collapse Button */}
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:block text-white hover:bg-white/10 p-2 rounded-full"
          >
            <FontAwesomeIcon icon={isSidebarCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
              {memberData.profilePic ? (
                <img 
                  src={memberData.profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserCircle} className="text-white text-2xl" />
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="text-white">
                <p className="font-medium">{memberData.firstName} {memberData.lastName}</p>
                <p className="text-sm opacity-75">{memberData.position}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <SidebarLink 
            icon={faHome}
            text="Overview"
            active={activeTab === 'overview'}
            collapsed={isSidebarCollapsed}
            onClick={() => {
              setActiveTab('overview');
              setIsMobileMenuOpen(false);
            }}
          />
          <SidebarLink 
            icon={faHistory}
            text="Transactions"
            active={activeTab === 'transactions'}
            collapsed={isSidebarCollapsed}
            onClick={() => {
              setActiveTab('transactions');
              setIsMobileMenuOpen(false);
            }}
          />
          <SidebarLink 
            icon={faFileAlt}
            text="Reports"
            active={activeTab === 'reports'}
            collapsed={isSidebarCollapsed}
            onClick={() => {
              setShowGenerateReport(true);
              setIsMobileMenuOpen(false);
            }}
          />
          <SidebarLink 
            icon={faComments}
            text="Chat Treasurer"
            collapsed={isSidebarCollapsed}
            onClick={() => window.open(`https://wa.me/${memberData.treasurerPhone}`)}
          />
          <SidebarLink 
            icon={faCog}
            text="Settings"
            active={activeTab === 'settings'}
            collapsed={isSidebarCollapsed}
            onClick={() => {
              setActiveTab('settings');
              setIsMobileMenuOpen(false);
            }}
          />
          <SidebarLink 
            icon={faSignOutAlt}
            text="Logout"
            collapsed={isSidebarCollapsed}
            onClick={handleLogout}
          />
        </nav>

        {/* Help Section */}
        {!isSidebarCollapsed && (
          <div className="absolute bottom-4 left-0 right-0 px-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm mb-2 text-white">Need help?</p>
              <button 
                onClick={() => window.open(`https://wa.me/${memberData.treasurerPhone}`)}
                className="text-xs bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 px-4 w-full text-white"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        {/* Header */}
        <header 
          className={`fixed z-20 transition-all duration-300 right-0
          ${isScrolled ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md' : 'bg-transparent'}
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
          style={{ 
            width: 'calc(100% - ' + (isSidebarCollapsed ? '5rem' : '16rem') + ')',
          }}
        >
          <div className="px-4 py-4 md:px-6">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <FontAwesomeIcon icon={faBars} className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Title */}
              <div className="flex-1 ml-4 lg:ml-0">
                <h1 className={`text-xl lg:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Welcome back, {memberData.firstName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {memberData.position}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-yellow-400' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                </button>

                {/* Quick Actions Dropdown */}
                <div className="relative group hidden md:block">
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-opacity-80 transition-colors">
                    <FontAwesomeIcon icon={faDownload} className="text-gray-600 dark:text-gray-200" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <button 
                        onClick={generateMonthlyStatement}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                        hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print Statement
                      </button>
                      <button 
                        onClick={generateAnnualReport}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                        hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                        Annual Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    className={`p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    } hover:bg-opacity-80 relative`}
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FontAwesomeIcon 
                      icon={faBell} 
                      className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} 
                    />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 
                        rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } ring-1 ring-black ring-opacity-5 max-h-[80vh] overflow-y-auto`}>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-lg font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                            Notifications
                          </h3>
                          <button 
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 
                            dark:hover:text-blue-300"
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            }}
                          >
                            Mark all as read
                          </button>
                        </div>
                        <div className="space-y-2">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              onClick={() => markNotificationRead(notification.id)}
                              className={`p-3 rounded-lg cursor-pointer ${
                                !notification.read 
                                  ? theme === 'dark' 
                                    ? 'bg-gray-700' 
                                    : 'bg-blue-50'
                                  : theme === 'dark'
                                    ? 'bg-gray-900'
                                    : 'bg-gray-50'
                              } hover:bg-opacity-80 transition-colors`}
                            >
                              <div className="flex items-start">
                                <div className={`p-2 rounded-full ${
                                  notification.type === 'success' 
                                    ? 'bg-green-100 text-green-600'
                                    : notification.type === 'warning'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-blue-100 text-blue-600'
                                } mr-3`}>
                                  <FontAwesomeIcon 
                                    icon={
                                      notification.type === 'success' 
                                        ? faCheck
                                        : notification.type === 'warning'
                                        ? faExclamation
                                        : faBell
                                    } 
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <span className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {notification.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                    rounded-full transition-colors p-1"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                      {memberData.profilePic ? (
                        <img 
                          src={memberData.profilePic} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'
                        }`}>
                          <FontAwesomeIcon 
                            icon={faUserCircle} 
                            className={`text-2xl ${
                              theme === 'dark' ? 'text-gray-300' : 'text-blue-600'
                            }`} 
                          />
                        </div>
                      )}
                    </div>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className="hidden md:block text-gray-600 dark:text-gray-300" 
                    />
                  </button>

                  {/* Profile Menu Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                      ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-2">
                        <div className="px-4 py-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {memberData.firstName} {memberData.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {memberData.phoneNumber}
                          </p>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                        <button
                          onClick={() => {
                            setShowEditProfile(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                          hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => setActiveTab('settings')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                          hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <FontAwesomeIcon icon={faCog} className="mr-2" />
                          Settings
                        </button>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                          dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-24 px-4 md:px-8 pb-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Balance"
                  value={`KES ${memberData.balance?.toLocaleString()}`}
                  icon={faWallet}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                  subtext="Your current balance"
                />
                <StatCard
                  title="Treasury Balance"
                  value={`KES ${memberData.treasuryBalance?.toLocaleString()}`}
                  icon={faChartLine}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                  subtext="Total group savings"
                />
                <StatCard
                  title="Defaulted Amount"
                  value={`KES ${memberData.defaultedAmount?.toLocaleString()}`}
                  icon={faExclamationTriangle}
                  color="bg-gradient-to-r from-red-500 to-red-600"
                  subtext="Outstanding payments"
                />
                <StatCard
                  title="Total Members"
                  value={memberData.memberCount}
                  icon={faUsers}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                  subtext={`${memberData.activeMembers} Active`}
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Contributions Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold mb-4 dark:text-white">Monthly Contributions</h3>
                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={memberData.monthlyContributions || []}>
                        <defs>
                          <linearGradient id="colorContribution" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                        />
                        <XAxis 
                          dataKey="month" 
                          stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        />
                        <YAxis 
                          stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                          tickFormatter={(value) => `KES ${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                            borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#2563eb" 
                          fill="url(#colorContribution)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Payment Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold mb-4 dark:text-white">Payment Distribution</h3>
                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Paid', value: memberData.balance || 0 },
                            { name: 'Defaulted', value: memberData.defaultedAmount || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                        >
                          <Cell fill="#2563eb" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold dark:text-white">Recent Transactions</h3>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 
                          dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 
                          dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 
                          dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 
                          dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {(memberData.recentTransactions || []).map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {transaction.date}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 
                            dark:text-white capitalize">
                            {transaction.type}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              transaction.type === 'deposit' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : '-'} 
                              KES {transaction.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 
                              font-semibold rounded-full ${
                                transaction.status === 'Completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 
                    transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Theme Settings</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center 
                    space-x-2 ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={faSun} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center 
                    space-x-2 ${
                      theme === 'dark'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={faMoon} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Edit Profile</h3>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {profileImage ? (
                        <img 
                          src={URL.createObjectURL(profileImage)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : memberData.profilePic ? (
                        <img 
                          src={memberData.profilePic} 
                          alt="Current" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FontAwesomeIcon 
                            icon={faUserCircle} 
                            className="text-4xl text-gray-400 dark:text-gray-500" 
                          />
                        </div>
                      )}
                    </div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <FontAwesomeIcon icon={faCamera} className="mr-2" />
                      Upload Photo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                    dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Generate Report</h3>
              <button 
                onClick={() => setShowGenerateReport(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  generateMonthlyStatement();
                  setShowGenerateReport(false);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 
                transition-colors flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                <span>Monthly Statement</span>
              </button>

              <button
                onClick={() => {
                  generateAnnualReport();
                  setShowGenerateReport(false);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 
                transition-colors flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                <span>Annual Report</span>
              </button>

              <button
                onClick={() => setShowGenerateReport(false)}
                className="w-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 
                py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPortal;