import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const MemberRow = ({ member, onDeposit, onWithdraw, onViewDetails }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {member.firstName} {member.lastName}
          </div>
          <div className="text-sm text-gray-500">{member.phoneNumber}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">
        KES {member.balance.toLocaleString()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        member.monthlyStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {member.monthlyStatus}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        member.registrationPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {member.registrationPaid ? 'Registered' : 'Pending'}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {member.lastTransaction?.date || 'No transactions'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end space-x-2">
        <button
          onClick={onDeposit}
          className="text-green-600 hover:text-green-900"
          title="Deposit"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={onWithdraw}
          className="text-red-600 hover:text-red-900"
          title="Withdraw"
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <button
          onClick={onViewDetails}
          className="text-purple-600 hover:text-purple-900"
          title="View Details"
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      </div>
    </td>
  </tr>
);

export default MemberRow;