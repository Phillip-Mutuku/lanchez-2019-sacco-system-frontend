import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const TransactionRow = ({ transaction, onViewDetails }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {transaction.member.firstName} {transaction.member.lastName}
          </div>
          <div className="text-sm text-gray-500">{transaction.member.phoneNumber}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {transaction.type}
      </span>
    </td>
    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
    }`}>
      {transaction.type === 'deposit' ? '+' : '-'} KES {transaction.amount.toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {transaction.date}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {transaction.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        onClick={onViewDetails}
        className="text-purple-600 hover:text-purple-900"
      >
        <FontAwesomeIcon icon={faEye} />
      </button>
    </td>
  </tr>
);

export default TransactionRow;