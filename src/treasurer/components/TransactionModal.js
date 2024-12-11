import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUserCircle, 
  faPlus, 
  faMinus 
} from '@fortawesome/free-solid-svg-icons';

const TransactionModal = ({
    isOpen,
    onClose,
    selectedMember,
    onSubmit,
    initialType = 'deposit'
  }) => {
    const [formData, setFormData] = useState({
      type: initialType,
      amount: '',
      purpose: 'monthly',
      description: ''
    });
  
    useEffect(() => {
      if (formData.purpose === 'monthly') {
        setFormData(prev => ({ ...prev, amount: '50' }));
      } else if (formData.purpose === 'registration') {
        setFormData(prev => ({ ...prev, amount: '100' }));
      }
    }, [formData.purpose]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await onSubmit({
          ...formData,
          memberId: selectedMember.id,
          amount: parseFloat(formData.amount)
        });
        onClose();
      } catch (error) {
        console.error('Transaction error:', error);
        toast.error('Transaction failed');
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-[500px] max-w-[90%]">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">New Transaction</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
  
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {selectedMember && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserCircle} className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">{`${selectedMember.firstName} ${selectedMember.lastName}`}</p>
                    <p className="text-sm text-gray-500">{selectedMember.phoneNumber}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Current Balance</p>
                    <p className="font-medium">KES {selectedMember.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monthly Status</p>
                    <p className={`font-medium ${
                      selectedMember.monthlyStatus === 'paid' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {selectedMember.monthlyStatus === 'paid' ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            )}
  
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'deposit' }))}
                  className={`py-3 rounded-xl border ${
                    formData.type === 'deposit'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'withdrawal' }))}
                  className={`py-3 rounded-xl border ${
                    formData.type === 'withdrawal'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faMinus} className="mr-2" />
                  Withdrawal
                </button>
              </div>
            </div>
  
            {/* Amount and Purpose */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="monthly">Monthly Contribution</option>
                <option value="registration">Registration Fee</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="Enter amount"
                required
              />
            </div>

            {formData.purpose === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Enter transaction description"
                  required
                />
              </div>
            )}
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Confirm Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;