
import React, { useState } from 'react';
import { ServiceType, BookingDetails, RideOption, CourierQuote } from '../types';
import { generateRideAndCourierOptions } from '../functions/api';

interface LocationPinIconProps {
  className?: string;
}
const LocationPinIcon: React.FC<LocationPinIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

interface PackageIconProps {
  className?: string;
}
const PackageIcon: React.FC<PackageIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" />
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
    <path d="M12 16v-4" />
    <path d="M3.29 7 12 12l8.71-5" />
    <path d="m7 16.5-4.5-2.5" />
    <path d="m17 16.5 4.5-2.5" />
  </svg>
);

interface BookingFormProps {
  onSearch: (details: BookingDetails) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResults: React.Dispatch<React.SetStateAction<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote } | null>>;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSearch, setIsLoading, setResults }) => {
  const [service, setService] = useState<ServiceType>(ServiceType.Ride);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [packageDetails, setPackageDetails] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Scheduling state
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pickup || !dropoff || (service === ServiceType.Courier && !packageDetails)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isRide && isScheduling && (!scheduledDate || !scheduledTime)) {
      setError('Please select a date and time for your scheduled ride.');
      return;
    }

    const bookingDetails: BookingDetails = { 
      service, 
      pickup, 
      dropoff, 
      packageDetails,
      scheduledDate: isRide && isScheduling ? scheduledDate : undefined,
      scheduledTime: isRide && isScheduling ? scheduledTime : undefined,
    };
    onSearch(bookingDetails);
    setIsLoading(true);

    try {
      const result = await generateRideAndCourierOptions(bookingDetails);
      setResults(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isRide = service === ServiceType.Ride;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setService(ServiceType.Ride)}
          className={`flex-1 py-3 text-sm font-bold focus:outline-none transition-colors ${isRide ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Book a Ride
        </button>
        <button
          onClick={() => setService(ServiceType.Courier)}
          className={`flex-1 py-3 text-sm font-bold focus:outline-none transition-colors ${!isRide ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Send a Package
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="pickup" className="sr-only">Pickup Location</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="pickup"
              id="pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
              placeholder="Pickup Location"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dropoff" className="sr-only">Drop-off Location</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="dropoff"
              id="dropoff"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
              placeholder={isRide ? "Where to?" : "Recipient's Address"}
            />
          </div>
        </div>

        {isRide && (
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="scheduling"
                name="scheduling"
                type="checkbox"
                checked={isScheduling}
                onChange={(e) => setIsScheduling(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="scheduling" className="ml-2 block text-sm text-gray-900">
                Schedule for later
              </label>
            </div>
            {isScheduling && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-md">
                <div>
                  <label htmlFor="date" className="block text-xs font-medium text-gray-700">Date</label>
                  <input type="date" id="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
                </div>
                 <div>
                  <label htmlFor="time" className="block text-xs font-medium text-gray-700">Time</label>
                  <input type="time" id="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
                </div>
              </div>
            )}
          </div>
        )}

        {!isRide && (
          <div>
            <label htmlFor="package" className="sr-only">Package Details</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PackageIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="package"
                id="package"
                value={packageDetails}
                onChange={(e) => setPackageDetails(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                placeholder="e.g., Small box, documents"
              />
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
        >
          {isRide ? (isScheduling ? 'Schedule Ride' : 'Find a Ride') : 'Get Quote'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;