import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faTimes, 
  faWallet, 
  faChartLine, 
  faCheck 
} from '@fortawesome/free-solid-svg-icons';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import StatCard from './StatCard';


const MemberDetailsModal = ({
    isOpen,
    onClose,
    member,
    onTransaction
  }) => {
    const [activeTab, setActiveTab] = useState('overview');
  
    if (!isOpen || !member) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-[800px] max-w-[90%] max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserCircle} className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{`${member.firstName} ${member.lastName}`}</h3>
                  <p className="text-gray-500">{member.position}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
  
            {/* Tabs */}
            <div className="flex space-x-4 mt-6">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabButton>
              <TabButton
                active={activeTab === 'transactions'}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </TabButton>
              <TabButton
                active={activeTab === 'contributions'}
                onClick={() => setActiveTab('contributions')}
              >
                Contributions
              </TabButton>
            </div>
          </div>
  
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Member Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <StatCard
                    title="Current Balance"
                    value={`KES ${member.balance.toLocaleString()}`}
                    icon={faWallet}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Contributions"
                    value={`KES ${member.totalContributions.toLocaleString()}`}
                    icon={faChartLine}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Monthly Status"
                    value={member.monthlyStatus === 'paid' ? 'Paid' : 'Pending'}
                    icon={faCheck}
                    color={member.monthlyStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}
                  />
                </div>
  
                {/* Member Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold mb-4">Member Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Phone Number" value={member.phoneNumber} />
                    <InfoItem label="Registration Date" value={member.registrationDate} />
                    <InfoItem label="Registration Status" value={member.registrationPaid ? 'Paid' : 'Not Paid'} />
                    <InfoItem label="Monthly Contribution" value={`KES ${member.monthlyContribution}`} />
                  </div>
                </div>
  
                {/* Contribution Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold mb-4">Contribution History</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={member.contributionHistory}>
                        <defs>
                          <linearGradient id="colorContribution" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#colorContribution)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Transaction History</h4>
                  <button
                    onClick={onTransaction}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    New Transaction
                  </button>
                </div>
  
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {member.transactionHistory.map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'deposit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'} KES {transaction.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
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
            )}
  
            {activeTab === 'contributions' && (
              <div className="space-y-6">
                {/* Monthly Contribution Status */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold mb-4">Monthly Contribution Status</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {member.monthlyContributions.map((month, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          month.status === 'paid'
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <p className="text-sm font-medium">{month.month}</p>
                        <p className={`text-sm ${
                          month.status === 'paid' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {month.status === 'paid' ? 'Paid' : 'Pending'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {month.dueDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
  
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onTransaction}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                New Transaction
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Utility Components
  const TabButton = ({ children, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-purple-100 text-purple-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
  
  const InfoItem = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );

  export default MemberDetailsModal;