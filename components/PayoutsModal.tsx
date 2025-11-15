import React, { useState, useEffect } from 'react';
import { PayoutDetails } from '../types';

interface PayoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: PayoutDetails) => void;
  currentDetails: PayoutDetails;
}

const PayoutsModal: React.FC<PayoutsModalProps> = ({ isOpen, onClose, onSave, currentDetails }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentDetails) {
      setBankName(currentDetails.bankName);
      setAccountNumber(currentDetails.accountNumber);
      setAccountName(currentDetails.accountName);
    }
  }, [currentDetails]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!bankName || !accountNumber || !accountName) {
      setError('All fields are required.');
      return;
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      setError('Please enter a valid 10-digit account number.');
      return;
    }
    onSave({ bankName, accountNumber, accountName });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-bold text-secondary">Manage Payouts</h3>
                <p className="text-sm text-gray-500">Add your bank details to receive payments.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                    type="text"
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="e.g., Guaranty Trust Bank"
                    required
                />
            </div>
            <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                    type="text"
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="0123456789"
                    maxLength={10}
                    required
                />
            </div>
            <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                <input
                    type="text"
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="As it appears on your bank account"
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PayoutsModal;