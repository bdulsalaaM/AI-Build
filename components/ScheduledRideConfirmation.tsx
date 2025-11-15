import React from 'react';
import { BookingDetails, RideOption } from '../types';

interface ScheduledRideConfirmationProps {
    details: {
        booking: BookingDetails;
        ride: RideOption;
    };
    onDone: () => void;
}

const ScheduledRideConfirmation: React.FC<ScheduledRideConfirmationProps> = ({ details, onDone }) => {
    const { booking, ride } = details;

    if (!booking.scheduledDate || !booking.scheduledTime) return null;

    const formattedDate = new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <div className="bg-primary-light py-12">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-secondary">Your Ride is Scheduled!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        We've confirmed your booking. A driver will be assigned closer to the pickup time.
                    </p>
                    <div className="mt-6 text-left border-t pt-4 space-y-3">
                         <div>
                            <p className="text-sm font-medium text-gray-500">Pickup Date & Time</p>
                            <p className="font-semibold text-primary">{formattedDate} at {booking.scheduledTime}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Route</p>
                            <p className="font-semibold text-gray-800">{booking.pickup} to {booking.dropoff}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ride Type</p>
                            <p className="font-semibold text-gray-800">{ride.type} ({ride.fare})</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button 
                            onClick={onDone}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduledRideConfirmation;