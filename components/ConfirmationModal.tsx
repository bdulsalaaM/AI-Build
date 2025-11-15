
import React from 'react';
import { BookingDetails, RideOption, CourierQuote, ServiceType } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: BookingDetails;
  selectedOption: RideOption | CourierQuote | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, bookingDetails, selectedOption }) => {
  if (!isOpen || !selectedOption) return null;

  const isRide = bookingDetails.service === ServiceType.Ride;
  const rideOption = isRide ? selectedOption as RideOption : null;
  const courierQuote = !isRide ? selectedOption as CourierQuote : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 border-b">
          <h3 className="text-2xl font-bold text-secondary">Confirm Your Booking</h3>
          <p className="text-sm text-gray-500">Please review the details below before confirming.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">From</p>
            <p className="font-semibold text-gray-800">{bookingDetails.pickup}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">To</p>
            <p className="font-semibold text-gray-800">{bookingDetails.dropoff}</p>
          </div>
          {bookingDetails.scheduledDate && bookingDetails.scheduledTime && (
             <div>
                <p className="text-sm font-medium text-gray-500">Scheduled for</p>
                <p className="font-semibold text-primary">{new Date(bookingDetails.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {bookingDetails.scheduledTime}</p>
            </div>
          )}
          <div className="border-t pt-4">
            {isRide && rideOption && (
              <>
                <p className="text-sm font-medium text-gray-500">Selected Ride</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-semibold text-lg text-gray-800">{rideOption.type}</span>
                  <span className="font-bold text-lg text-primary">{rideOption.fare}</span>
                </div>
                 <p className="text-sm text-gray-500">{rideOption.eta} away</p>
              </>
            )}
            {!isRide && courierQuote && (
               <>
                <p className="text-sm font-medium text-gray-500">Courier Service</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-semibold text-lg text-gray-800">Standard Delivery</span>
                  <span className="font-bold text-lg text-primary">{courierQuote.fare}</span>
                </div>
                 <p className="text-sm text-gray-500">Est. delivery: {courierQuote.eta}</p>
              </>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            Confirm Booking
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

export default ConfirmationModal;