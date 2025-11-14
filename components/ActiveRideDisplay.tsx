import React, { useState, useEffect } from 'react';
import { RideOption, BookingDetails, DriverDetails } from '../types';

// Re-using icons from ResultsDisplay
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

interface StarIconProps { className?: string; }
const StarIcon: React.FC<StarIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);


interface ActiveRideDisplayProps {
    ride: RideOption;
    bookingDetails: BookingDetails;
    driverDetails: DriverDetails | null;
    isFetchingDriver: boolean;
    onEndRide: () => void;
}

const ActiveRideDisplay: React.FC<ActiveRideDisplayProps> = ({ ride, bookingDetails, driverDetails, isFetchingDriver, onEndRide }) => {
    type RideStatus = 'in_progress' | 'needs_rating' | 'completed';
    const [rideStatus, setRideStatus] = useState<RideStatus>('in_progress');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [currentEtaMins, setCurrentEtaMins] = useState<number>(() => {
        const match = ride.eta.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    });

    useEffect(() => {
        if (rideStatus !== 'in_progress' || currentEtaMins <= 0) return;

        const timer = setInterval(() => {
            setCurrentEtaMins(prev => Math.max(0, prev - 1));
        }, 15000); // Update every 15 seconds for simulation

        return () => clearInterval(timer);
    }, [currentEtaMins, rideStatus]);
    
    const getEtaText = () => {
        if (currentEtaMins > 1) return `Arriving in ${currentEtaMins} mins`;
        if (currentEtaMins === 1) return 'Arriving in 1 min';
        return 'Arriving now...';
    }

    const handleRatingSubmit = () => {
        console.log(`Rating submitted: ${rating} stars`);
        setRideStatus('completed');
        setTimeout(() => onEndRide(), 1000); // Show thank you message then reset
    };

    const renderInProgress = () => (
        <>
            <h3 className="text-xl font-bold text-secondary">Your ride is on the way!</h3>
            <p className="text-sm text-gray-500">
                Your driver will pick you up at {bookingDetails.pickup}.
            </p>
            {isFetchingDriver && (
                 <div className="my-6 animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-md"></div>
                 </div>
            )}
            {driverDetails && (
                 <div className="my-6 p-4 bg-primary-light rounded-lg border border-primary/20 flex items-center space-x-4">
                    <img src={driverDetails.photoUrl} alt={driverDetails.name} className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"/>
                    <div className="text-left">
                        <p className="font-bold text-lg text-primary">{driverDetails.name}</p>
                        <p className="text-sm text-gray-600">{driverDetails.vehicle}</p>
                        <p className="text-sm font-mono bg-gray-200 px-2 py-1 rounded inline-block mt-1">{driverDetails.licensePlate}</p>
                    </div>
                </div>
            )}
            <div className="my-8 flex items-center justify-center space-x-4">
                <div className="bg-primary-light p-3 rounded-full">
                    <RideIcon icon={ride.icon} className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-xl">{ride.type}</h4>
                    <p className="text-md text-gray-600">{ride.fare}</p>
                </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-lg font-semibold text-green-800 animate-pulse">{getEtaText()}</p>
            </div>
            <button onClick={() => setRideStatus('needs_rating')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                Complete Ride
            </button>
        </>
    );

    const renderRating = () => (
        <>
            <h3 className="text-2xl font-bold text-secondary">How was your ride?</h3>
            {driverDetails && (
                 <div className="my-6 flex flex-col items-center space-y-2">
                    <img src={driverDetails.photoUrl} alt={driverDetails.name} className="h-20 w-20 rounded-full object-cover border-2 border-primary-light shadow-lg"/>
                    <p className="font-semibold text-gray-700">Rate your driver, {driverDetails.name}</p>
                </div>
            )}
            <div className="flex justify-center my-6 space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                    >
                        <StarIcon className={`h-10 w-10 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
                <button onClick={onEndRide} className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Skip
                </button>
                <button onClick={handleRatingSubmit} disabled={rating === 0} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Submit Rating
                </button>
            </div>
        </>
    );

    const renderCompleted = () => (
        <div className="py-10">
            <h3 className="text-2xl font-bold text-green-600">Thank you!</h3>
            <p className="text-gray-600 mt-2">Your feedback helps us improve.</p>
        </div>
    );
    
    const renderContent = () => {
        switch(rideStatus) {
            case 'in_progress': return renderInProgress();
            case 'needs_rating': return renderRating();
            case 'completed': return renderCompleted();
            default: return null;
        }
    }

    return (
        <div className="bg-primary-light py-12">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center transition-all duration-300">
                   {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ActiveRideDisplay;
