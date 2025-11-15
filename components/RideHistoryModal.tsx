import React from 'react';
import { RideHistoryItem } from '../types';

interface RideHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: RideHistoryItem[];
}

const RideHistoryModal: React.FC<RideHistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-secondary">Your History</h3>
            <p className="text-sm text-gray-500">A log of your completed trips and deliveries.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      {item.service === 'ride' ? (
                         <>
                           <p className="font-bold text-lg text-primary">{item.rideType}</p>
                           <p className="text-sm text-gray-500">with {item.driverName}</p>
                         </>
                      ) : (
                         <>
                           <p className="font-bold text-lg text-primary">Courier Delivery</p>
                           <p className="text-sm text-gray-500">ID: {item.trackingId}</p>
                         </>
                      )}
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-lg text-secondary">{item.fare}</p>
                       <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                    <p><span className="font-semibold">From:</span> {item.pickup}</p>
                    <p><span className="font-semibold">To:</span> {item.dropoff}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No history yet</h3>
              <p className="mt-1 text-sm text-gray-500">Complete a trip or delivery to see it here.</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Close
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

export default RideHistoryModal;