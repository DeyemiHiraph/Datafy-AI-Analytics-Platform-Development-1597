import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiCheck, FiX, FiSettings, FiSend, FiBell } = FiIcons;

const TeamsIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [notifications, setNotifications] = useState({
    dailyReports: true,
    alertsOnly: false,
    queryResults: true
  });
  const [testMessage, setTestMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkTeamsConnection();
  }, []);

  const checkTeamsConnection = async () => {
    try {
      const response = await fetch('/api/integrations/teams/status');
      const data = await response.json();
      setIsConnected(data.connected);
      if (data.connected) {
        setTeams(data.teams || []);
        setChannels(data.channels || []);
      }
    } catch (error) {
      console.error('Error checking Teams connection:', error);
    }
  };

  const connectTeams = () => {
    // Redirect to Microsoft OAuth
    const clientId = import.meta.env.VITE_TEAMS_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/integrations/teams/callback`);
    const scopes = 'https://graph.microsoft.com/Team.ReadBasic.All https://graph.microsoft.com/Channel.ReadBasic.All https://graph.microsoft.com/ChatMessage.Send';
    
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}`;
  };

  const disconnectTeams = async () => {
    setLoading(true);
    try {
      await fetch('/api/integrations/teams/disconnect', { method: 'POST' });
      setIsConnected(false);
      setTeams([]);
      setChannels([]);
      setSelectedChannels([]);
    } catch (error) {
      console.error('Error disconnecting Teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChannels = async (teamId) => {
    if (!teamId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/integrations/teams/channels?team=${teamId}`);
      const data = await response.json();
      setChannels(data.channels || []);
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async () => {
    setLoading(true);
    try {
      await fetch('/api/integrations/teams/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels: selectedChannels,
          settings: notifications
        })
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim() || selectedChannels.length === 0) return;

    setLoading(true);
    try {
      await fetch('/api/integrations/teams/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMessage,
          channels: selectedChannels
        })
      });
      setTestMessage('');
      alert('Test message sent successfully!');
    } catch (error) {
      console.error('Error sending test message:', error);
      alert('Failed to send test message');
    } finally {
      setLoading(false);
    }
  };

  const toggleChannel = (channelId) => {
    setSelectedChannels(prev => 
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-500" />
            <span>Microsoft Teams Integration</span>
          </h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            <SafeIcon icon={isConnected ? FiCheck : FiX} className="w-4 h-4" />
            <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiUsers} className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connect your Microsoft Teams
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get reports and alerts directly in your Teams channels
            </p>
            <button
              onClick={connectTeams}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Connect to Teams
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-300">
                Microsoft Teams connected successfully
              </p>
              <button
                onClick={disconnectTeams}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Team Configuration */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Configuration
          </h4>

          {/* Team Selection */}
          {teams.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => {
                  setSelectedTeam(e.target.value);
                  loadChannels(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Channel Selection */}
          {channels.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Channels for Notifications
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {channels.map((channel) => (
                  <label key={channel.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded">
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel.id)}
                      onChange={() => toggleChannel(channel.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {channel.displayName}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 dark:text-white">Notification Preferences</h5>
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {key === 'dailyReports' && 'Daily Reports'}
                  {key === 'alertsOnly' && 'Alerts Only'}
                  {key === 'queryResults' && 'Query Results'}
                </span>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            ))}
          </div>

          <button
            onClick={updateNotificationSettings}
            disabled={loading || selectedChannels.length === 0}
            className="w-full mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Save Configuration'}
          </button>
        </motion.div>
      )}

      {/* Test Message */}
      {isConnected && selectedChannels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Send Test Message
          </h4>
          <div className="flex space-x-3">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a test message..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
            />
            <button
              onClick={sendTestMessage}
              disabled={loading || !testMessage.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              <SafeIcon icon={FiSend} className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Features List */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Features
        </h4>
        <div className="space-y-3">
          {[
            { icon: FiBell, title: 'Real-time Alerts', description: 'Get notified about important data changes' },
            { icon: FiSend, title: 'Report Sharing', description: 'Automatically share daily/weekly reports' },
            { icon: FiSettings, title: 'Custom Notifications', description: 'Configure what notifications you want to receive' }
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <SafeIcon icon={feature.icon} className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">{feature.title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsIntegration;