import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt,
  faChartLine,
  faUsers,
  faDownload,
  faTimes,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ReportModal = ({ isOpen, onClose, onGenerate }) => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(reportType, dateRange);
      onClose();
    } catch (error) {
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const reportTypes = [
    {
      id: 'monthly',
      title: 'Monthly Statement',
      description: 'Detailed monthly transaction report and contribution analysis',
      icon: faFileAlt,
      color: 'blue'
    },
    {
      id: 'annual',
      title: 'Annual Report',
      description: 'Comprehensive yearly financial summary and statistics',
      icon: faChartLine,
      color: 'green'
    },
    {
      id: 'members',
      title: 'Members Report',
      description: 'Detailed member contribution and activity analysis',
      icon: faUsers,
      color: 'purple'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[600px] max-w-[90%]">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Generate Report</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Select Report Type</h4>
            <div className="grid grid-cols-1 gap-4">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`flex items-start p-4 border rounded-xl transition-colors ${
                    reportType === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${type.color}-100 flex items-center justify-center mr-4`}>
                    <FontAwesomeIcon icon={type.icon} className={`text-${type.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{type.title}</h5>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    reportType === type.id
                      ? `border-${type.color}-500 bg-${type.color}-500`
                      : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {reportType === type.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Select Date Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  dateFormat="MMMM d, yyyy"
                  maxDate={new Date()}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">End Date</label>
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  dateFormat="MMMM d, yyyy"
                  minDate={dateRange.startDate}
                  maxDate={new Date()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;