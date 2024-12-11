const SettingsPanel = ({ treasurer, onUpdateSettings, onUpdateProfile }) => {
    const [activeSection, setActiveSection] = useState('profile');
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileData, setProfileData] = useState({
      firstName: treasurer?.firstName || '',
      lastName: treasurer?.lastName || '',
      phoneNumber: treasurer?.phoneNumber || '',
      email: treasurer?.email || ''
    });
  
    const [securityData, setSecurityData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  
    const [notificationSettings, setNotificationSettings] = useState({
      emailNotifications: true,
      smsNotifications: true,
      contributionReminders: true,
      monthlyReports: true
    });
  
    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      setIsUpdating(true);
      try {
        await onUpdateProfile(profileData);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        setIsUpdating(false);
      }
    };
  
    const handlePasswordUpdate = async (e) => {
      e.preventDefault();
      if (securityData.newPassword !== securityData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      setIsUpdating(true);
      try {
        await onUpdateSettings({ type: 'security', data: securityData });
        toast.success('Password updated successfully');
        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        toast.error('Failed to update password');
      } finally {
        setIsUpdating(false);
      }
    };
  
    const handleNotificationUpdate = async (settings) => {
      try {
        await onUpdateSettings({ type: 'notifications', data: settings });
        setNotificationSettings(settings);
        toast.success('Notification settings updated');
      } catch (error) {
        toast.error('Failed to update notification settings');
      }
    };
  
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
          </div>
  
          <div className="grid grid-cols-4 min-h-[600px]">
            {/* Settings Navigation */}
            <div className="col-span-1 border-r border-gray-200 p-6">
              <nav className="space-y-2">
                <SettingsNavButton
                  active={activeSection === 'profile'}
                  onClick={() => setActiveSection('profile')}
                  icon={faUserCircle}
                >
                  Profile
                </SettingsNavButton>
                <SettingsNavButton
                  active={activeSection === 'security'}
                  onClick={() => setActiveSection('security')}
                  icon={faLock}
                >
                  Security
                </SettingsNavButton>
                <SettingsNavButton
                  active={activeSection === 'notifications'}
                  onClick={() => setActiveSection('notifications')}
                  icon={faBell}
                >
                  Notifications
                </SettingsNavButton>
              </nav>
            </div>
  
            {/* Settings Content */}
            <div className="col-span-3 p-6">
              {activeSection === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              )}
  
              {activeSection === 'security' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
                )}

                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-4">Communication Preferences</h4>
                      <div className="space-y-4">
                        <NotificationToggle
                          label="Email Notifications"
                          description="Receive updates and alerts via email"
                          checked={notificationSettings.emailNotifications}
                          onChange={(checked) => handleNotificationUpdate({
                            ...notificationSettings,
                            emailNotifications: checked
                          })}
                        />
                        <NotificationToggle
                          label="SMS Notifications"
                          description="Receive important alerts via SMS"
                          checked={notificationSettings.smsNotifications}
                          onChange={(checked) => handleNotificationUpdate({
                            ...notificationSettings,
                            smsNotifications: checked
                          })}
                        />
                      </div>
                    </div>
    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-4">Alert Settings</h4>
                      <div className="space-y-4">
                        <NotificationToggle
                          label="Contribution Reminders"
                          description="Get notified when contributions are due"
                          checked={notificationSettings.contributionReminders}
                          onChange={(checked) => handleNotificationUpdate({
                            ...notificationSettings,
                            contributionReminders: checked
                          })}
                        />
                        <NotificationToggle
                          label="Monthly Reports"
                          description="Receive automated monthly reports"
                          checked={notificationSettings.monthlyReports}
                          onChange={(checked) => handleNotificationUpdate({
                            ...notificationSettings,
                            monthlyReports: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    // Utility Components for Settings
    const SettingsNavButton = ({ children, active, onClick, icon }) => (
      <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${
          active
            ? 'bg-purple-100 text-purple-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <FontAwesomeIcon icon={icon} />
        <span>{children}</span>
      </button>
    );
    
    const NotificationToggle = ({ label, description, checked, onChange }) => (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>
    );
    
    // Chart Components
    const TreasuryChart = ({ data, timeRange, onTimeRangeChange }) => (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Treasury Growth</h3>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
    );
    
    const ContributionDistributionChart = ({ data }) => (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-6">Contribution Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
    
    const MemberContributionsChart = ({ data, memberId }) => (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-6">Member Contributions</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
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
              <Legend />
              <Bar 
                dataKey="amount" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
    
    // Export all components
    export {
      SettingsPanel,
      TreasuryChart,
      ContributionDistributionChart,
      MemberContributionsChart
    };