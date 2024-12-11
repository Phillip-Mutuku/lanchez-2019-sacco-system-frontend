import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWallet, 
  faUsers, 
  faChartLine, 
  faMoneyBillTransfer,
  faBars,
  faHome,
  faHistory,
  faFileAlt,
  faUserPlus,
  faSignOutAlt,
  faChevronLeft,
  faChevronRight,
  faCog,
  faBell,
  faSearch,
  faUserCircle,
  faPlus,
  faMinus,
  faCalendarAlt,
  faFilter,
  faEllipsisVertical,
  faExclamationTriangle,
  faCheck,
  faTimes,
  faDownload,
  faPrint,
  faEnvelope
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
  Cell,
  BarChart,
  Bar
} from 'recharts';
import debounce from 'lodash/debounce';

// Import Components
import StatCard from './components/StatCard';
import SidebarLink from './components/SidebarLink';
import TransactionModal from './components/TransactionModal';
import NotificationPanel from './components/NotificationPanel';
import MemberDetailsModal from './components/MemberDetailsModal';
import ReportModal from './components/ReportModal';
import LoadingSpinner from './components/LoadingSpinner';
import TransactionRow from './components/TransactionRow';
import MemberRow from './components/MemberRow';
import ReportCard from './components/ReportCard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const TreasurerDashboard = () => {
  const navigate = useNavigate();
  
  // State Management
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBalance: 0,
      monthlyContributions: 0,
      pendingPayments: 0,
      totalMembers: 0
    },
    transactions: [],
    contributionStats: [],
    registrationStats: {
      registered: 0,
      pending: 0,
      total: 0
    }
  });
  
  const [uiState, setUiState] = useState({
    isSidebarOpen: true,
    isSidebarCollapsed: false,
    activeTab: 'overview',
    isLoading: false,
    showTransactionModal: false,
    showMemberModal: false,
    showReportModal: false,
    showNotifications: false,
    filterDate: 'month',
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 10
  });

  const [filters, setFilters] = useState({
    dateRange: 'all',
    transactionType: 'all',
    paymentStatus: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [selectedMember, setSelectedMember] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Constants
  const REGISTRATION_FEE = 100;
  const MONTHLY_CONTRIBUTION = 50;

  // Check Authentication
/*   useEffect(() => {
    const token = localStorage.getItem('treasurerToken');
    if (!token) {
      navigate('/treasurer/login');
      return;
    }

    // Verify token
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/treasurer/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('treasurerToken');
        navigate('/treasurer/login');
      }
    };

    verifyToken();
  }, [navigate]); */

  // Initial Data Fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      setUiState(prev => ({ ...prev, isLoading: true }));
      try {
        const [statsResponse, membersResponse, notificationsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/treasurer/dashboard-stats', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
            }
          }),
          fetch('http://localhost:5000/api/treasurer/members', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
            }
          }),
          fetch('http://localhost:5000/api/treasurer/notifications', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
            }
          })
        ]);

        const [stats, membersData, notificationsData] = await Promise.all([
          statsResponse.json(),
          membersResponse.json(),
          notificationsResponse.json()
        ]);

        if (!statsResponse.ok || !membersResponse.ok || !notificationsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        setDashboardData(stats.data);
        setMembers(membersData.data.members);
        setFilteredMembers(membersData.data.members);
        setNotifications(notificationsData.data);

      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  // Search and Filter Handlers
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/treasurer/members/search?term=${term}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
          }
        }
      );
  
      if (!response.ok) {
        throw new Error('Search failed');
      }
  
      const data = await response.json();
      setSearchResults(data.data.members);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };


  const handleMemberSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
  
      setIsSearching(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/treasurer/members/search?term=${term}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
            }
          }
        );
  
        if (!response.ok) {
          throw new Error('Search failed');
        }
  
        const data = await response.json();
        setSearchResults(data.data.members);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );


  const handleContribution = async (memberId, amount) => {
    setUiState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('http://localhost:5000/api/treasurer/contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
        },
        body: JSON.stringify({
          memberId,
          amount,
          type: 'deposit',
          purpose: 'monthly_contribution'
        })
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
  
      // Refresh dashboard data
      await refreshDashboardData();
      toast.success('Contribution recorded successfully');
    } catch (error) {
      console.error('Contribution error:', error);
      toast.error(error.message || 'Failed to record contribution');
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };



  // UI State Handlers
  const toggleSidebar = () => {
    setUiState(prev => ({
      ...prev,
      isSidebarOpen: !prev.isSidebarOpen
    }));
  };

  const handleTabChange = (tab) => {
    setUiState(prev => ({
      ...prev,
      activeTab: tab
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('treasurerToken');
    navigate('/treasurer/login');
  };

  // Transaction Handlers
  const handleTransaction = async (transactionData) => {
    setUiState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('http://localhost:5000/api/treasurer/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Transaction failed');
      }

      // Update dashboard data
      await refreshDashboardData();
      
      setUiState(prev => ({ 
        ...prev, 
        showTransactionModal: false 
      }));
      
      toast.success('Transaction completed successfully');
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Transaction failed');
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshDashboardData = async () => {
    try {
      const [statsResponse, membersResponse] = await Promise.all([
        fetch('http://localhost:5000/api/treasurer/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
          }
        }),
        fetch('http://localhost:5000/api/treasurer/members', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
          }
        })
      ]);

      const [stats, membersData] = await Promise.all([
        statsResponse.json(),
        membersResponse.json()
      ]);

      setDashboardData(stats.data);
      setMembers(membersData.data.members);
      setFilteredMembers(membersData.data.members);
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh data');
    }
  };

  // Report Generation
  const handleGenerateReport = async (reportType, dateRange) => {
    setUiState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('http://localhost:5000/api/treasurer/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
        },
        body: JSON.stringify({ type: reportType, ...dateRange })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `treasury_report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Member Management
  const handleMemberAction = async (action, memberId) => {
    setUiState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`http://localhost:5000/api/treasurer/members/${memberId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      await refreshDashboardData();
      toast.success(`Member ${action} successful`);
    } catch (error) {
      console.error('Member action error:', error);
      toast.error(error.message);
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Notification Handlers
  const handleNotificationRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/treasurer/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('treasurerToken')}`
        }
      });

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  // Render Functions
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Treasury Balance"
              value={`KES ${dashboardData.stats.totalBalance.toLocaleString()}`}
              icon={faWallet}
              change={dashboardData.stats.balanceChange}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <StatCard
              title="Monthly Contributions"
              value={`KES ${dashboardData.stats.monthlyContributions.toLocaleString()}`}
              icon={faChartLine}
              change={dashboardData.stats.contributionChange}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <StatCard
              title="Pending Payments"
              value={`KES ${dashboardData.stats.pendingPayments.toLocaleString()}`}
              icon={faMoneyBillTransfer}
              change={dashboardData.stats.pendingChange}
              color="bg-gradient-to-r from-red-500 to-red-600"
            />
            <StatCard
              title="Total Members"
              value={`${dashboardData.stats.totalMembers} Members`}
              subtext={`${dashboardData.stats.registeredMembers} Registered`}
              icon={faUsers}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
          </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Treasury Growth</h3>
            <select
              value={uiState.filterDate}
              onChange={(e) => setUiState(prev => ({ ...prev, filterDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.contributionStats}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6B7280' }}
                  tickLine={{ stroke: '#6B7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  tickLine={{ stroke: '#6B7280' }}
                  tickFormatter={(value) => `KES ${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-6">Contribution Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Paid', value: dashboardData.stats.paidContributions },
                    { name: 'Pending', value: dashboardData.stats.pendingPayments }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip 
                  formatter={(value) => `KES ${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <button
              onClick={() => setUiState(prev => ({ ...prev, activeTab: 'transactions' }))}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dashboardData.transactions.map((transaction, index) => (
                <TransactionRow
                  key={index}
                  transaction={transaction}
                  onViewDetails={() => {
                    setSelectedMember(transaction.member);
                    setUiState(prev => ({ ...prev, showMemberModal: true }));
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Members Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              value={uiState.searchTerm}
              onChange={(e) => {
                setUiState(prev => ({ ...prev, searchTerm: e.target.value }));
                handleSearch(e.target.value);
              }}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            onClick={() => setUiState(prev => ({ ...prev, showTransactionModal: true }))}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Transaction
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Contribution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Transaction
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onDeposit={() => {
                    setSelectedMember(member);
                    setUiState(prev => ({
                      ...prev,
                      showTransactionModal: true,
                      initialTransactionType: 'deposit'
                    }));
                  }}
                  onWithdraw={() => {
                    setSelectedMember(member);
                    setUiState(prev => ({
                      ...prev,
                      showTransactionModal: true,
                      initialTransactionType: 'withdrawal'
                    }));
                  }}
                  onViewDetails={() => {
                    setSelectedMember(member);
                    setUiState(prev => ({ ...prev, showMemberModal: true }));
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredMembers.length ? (uiState.currentPage - 1) * uiState.itemsPerPage + 1 : 0} to{' '}
              {Math.min(uiState.currentPage * uiState.itemsPerPage, filteredMembers.length)} of{' '}
              {filteredMembers.length} members
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setUiState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={uiState.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setUiState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={uiState.currentPage * uiState.itemsPerPage >= filteredMembers.length}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Transactions Tab
  const renderTransactionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filters.transactionType}
            onChange={(e) => setFilters(prev => ({ ...prev, transactionType: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => setUiState(prev => ({ ...prev, showTransactionModal: true }))}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Transaction
          </button>
        </div>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                KES {dashboardData.stats.totalDeposits.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">
                KES {dashboardData.stats.totalWithdrawals.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faMinus} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Net Movement</p>
              <p className={`text-2xl font-bold ${dashboardData.stats.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KES {Math.abs(dashboardData.stats.netMovement).toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              dashboardData.stats.netMovement >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <FontAwesomeIcon 
                icon={dashboardData.stats.netMovement >= 0 ? faChartLine : faExclamationTriangle} 
                className={dashboardData.stats.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.transactions
                .filter(transaction => {
                  if (filters.transactionType !== 'all' && transaction.type !== filters.transactionType) return false;
                  // Add more filter logic here
                  return true;
                })
                .map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onViewDetails={() => {
                      setSelectedMember(transaction.member);
                      setUiState(prev => ({ ...prev, showMemberModal: true }));
                    }}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Reports Tab
  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analysis</h2>
        <button
          onClick={() => setUiState(prev => ({ ...prev, showReportModal: true }))}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Generate New Report
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard
          title="Monthly Statement"
          description="Comprehensive monthly transaction and contribution report"
          icon={faFileAlt}
          onGenerate={() => handleGenerateReport('monthly')}
        />
        <ReportCard
          title="Annual Report"
          description="Complete yearly financial analysis and statistics"
          icon={faChartLine}
          onGenerate={() => handleGenerateReport('annual')}
        />
        <ReportCard
          title="Member Analysis"
          description="Detailed member contribution and activity report"
          icon={faUsers}
          onGenerate={() => handleGenerateReport('members')}
        />
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {dashboardData.recentReports?.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
              </div>
              <button
                onClick={() => handleGenerateReport(report.type, report.dateRange)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50">
      {uiState.isLoading && <LoadingSpinner />}
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={uiState.isSidebarOpen}
          isCollapsed={uiState.isSidebarCollapsed}
          activeTab={uiState.activeTab}
          onTabChange={handleTabChange}
          onCollapse={() => setUiState(prev => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }))}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${
          uiState.isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          {/* Header */}
       <Header
          searchTerm={searchTerm}
          onSearch={handleSearch}
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          isSearching={isSearching}
          searchResults={searchResults}
          onSelectMember={(member) => {
            setSelectedMember(member);
            setUiState(prev => ({ ...prev, showMemberModal: true }));
          }}
          onClearSearch={() => {
            setSearchTerm('');
            setSearchResults([]);
          }}
        />

          {/* Content Area */}
          <div className="p-6">
            {uiState.activeTab === 'overview' && renderOverviewTab()}
            {uiState.activeTab === 'members' && renderMembersTab()}
            {uiState.activeTab === 'transactions' && renderTransactionsTab()}
            {uiState.activeTab === 'reports' && renderReportsTab()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={uiState.showTransactionModal}
        onClose={() => setUiState(prev => ({ ...prev, showTransactionModal: false }))}
        selectedMember={selectedMember}
        onSubmit={handleTransaction}
        initialType={uiState.initialTransactionType}
      />

      <MemberDetailsModal
        isOpen={uiState.showMemberModal}
        onClose={() => setUiState(prev => ({ ...prev, showMemberModal: false }))}
        member={selectedMember}
        onTransaction={() => {
          setUiState(prev => ({
            ...prev,
            showMemberModal: false,
            showTransactionModal: true
          }));
        }}
      />

      <ReportModal
        isOpen={uiState.showReportModal}
        onClose={() => setUiState(prev => ({ ...prev, showReportModal: false }))}
        onGenerate={handleGenerateReport}
      />
    </div>
  );
};

export default TreasurerDashboard;