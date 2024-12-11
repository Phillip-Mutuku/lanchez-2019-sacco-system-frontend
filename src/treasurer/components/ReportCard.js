import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ReportCard = ({ title, description, icon, onGenerate }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
        <FontAwesomeIcon icon={icon} className="text-purple-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <button
          onClick={onGenerate}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Generate Report
        </button>
      </div>
    </div>
  </div>
);

export default ReportCard;