
import React from 'react';
import { BookingDetails, RideOption, CourierQuote, ServiceType } from '../types';

interface CarIconProps { className?: string; }
const CarIcon: React.FC<CarIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 16.5 19.5 12 22 15"/><path d="m2 14 3-3 3 3"/><path d="M3 21h18"/><path d="M6 18h.01"/><path d="M7 15h10v-4.48a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 7 10.52V15Z"/><path d="M18 18h.01"/></svg>
);

interface BikeIconProps { className?: string; }
const BikeIcon: React.FC<BikeIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2"/><path d="M9 17.5H5.5"/><path d="M18.5 17.5H15"/></svg>
);

interface LuxuryIconProps { className?: string; }
const LuxuryIcon: React.FC<LuxuryIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C20.7 10.1 21 9.6 21 9v-2c0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1v2c0 .6.3 1.1.5 1.4C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><path d="M12 8V6"/><path d="M2 12h20"/><path d="m3 17 2-5h14l2 5"/><path d="M12 12v5"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
);


const RideIcon: React.FC<{ icon: RideOption['icon'], className?: string }> = ({ icon, className }) => {
    switch(icon) {
        case 'car': return <CarIcon className={className} />;
        case 'bike': return <BikeIcon className={className} />;
        case 'luxury': return <LuxuryIcon className={className} />;
        default: return <CarIcon className={className} />;
    }
}

interface ResultsDisplayProps {
    bookingDetails: BookingDetails;
    results: { rideOptions?: RideOption[]; courierQuote?: CourierQuote } | null;
    isLoading: boolean;
    onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-600">Finding the best options for you...</p>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ bookingDetails, results, isLoading, onReset }) => {
    const isRide = bookingDetails.service === ServiceType.Ride;

    const renderRideOptions = () => (
        <div className="space-y-4">
            {results?.rideOptions?.map((option, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md hover:border-primary transition-all duration-300">
                    <div className="flex items-center">
                        <div className="bg-primary-light p-3 rounded-full mr-4">
                           <RideIcon icon={option.icon} className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{option.type}</h4>
                            <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg text-primary">{option.fare}</p>
                        <p className="text-sm text-gray-500">{option.eta} away</p>
                    </div>
                </div>
            ))}
             <button className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
                Confirm Ride
            </button>
        </div>
    );

    const renderCourierQuote = () => (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
             <div>
                <h4 className="font-semibold text-lg">Your Courier Quote</h4>
                <p className="text-sm text-gray-500">{results?.courierQuote?.description}</p>
             </div>
             <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Estimated Cost</span>
                <span className="font-bold text-2xl text-primary">{results?.courierQuote?.fare}</span>
             </div>
             <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Delivery Time</span>
                <span className="font-semibold text-gray-800">{results?.courierQuote?.eta}</span>
             </div>
             <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Tracking ID</span>
                <span className="font-mono text-sm text-primary bg-primary-light px-2 py-1 rounded">{results?.courierQuote?.trackingId}</span>
             </div>
             <button className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
                Book Courier
            </button>
        </div>
    );

    return (
        <div className="bg-primary-light py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                        <div>
                            <h3 className="text-xl font-bold text-secondary">Your Request</h3>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">From:</span> {bookingDetails.pickup} <br/>
                                <span className="font-semibold">To:</span> {bookingDetails.dropoff}
                            </p>
                        </div>
                        <button onClick={onReset} className="text-sm font-medium text-primary hover:text-primary-dark">
                            New Search
                        </button>
                    </div>
                    
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && results && (isRide ? renderRideOptions() : renderCourierQuote())}
                    {!isLoading && !results && <p className="text-center text-red-500">Could not fetch options. Please try again.</p>}
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
