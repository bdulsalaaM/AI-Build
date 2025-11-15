import React, { useState, useEffect, useRef } from 'react';
import { User, RideRequest, PayoutDetails } from '../types';
import { generateMockRideRequest } from '../functions/api';
import PayoutsModal from './PayoutsModal';
import MapView from './MapView';
import VehicleModal from './VehicleModal';

interface DriverDashboardProps {
    currentUser: User;
    showToast: (message: string) => void;
    onUpdateDriverDetails: (details: User['driverDetails']) => void;
}

const RideRequestCard: React.FC<{ request: RideRequest, onAccept: (id: string) => void, onDecline: (id: string) => void }> = ({ request, onAccept, onDecline }) => {
    const [timeLeft, setTimeLeft] = useState(Math.round((request.expiresAt - Date.now()) / 1000));

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);
    
    const progress = (timeLeft / 30) * 100;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 relative overflow-hidden">
            <div className="z-10 relative">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-500">New Ride Request</p>
                    <p className="text-lg font-bold text-primary">{request.fare}</p>
                </div>
                <div className="mt-3 text-sm space-y-1">
                    <p><span className="font-semibold text-gray-600">From:</span> {request.pickup}</p>
                    <p><span className="font-semibold text-gray-600">To:</span> {request.dropoff}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button onClick={() => onDecline(request.id)} className="w-full py-2 text-sm font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">Decline</button>
                    <button onClick={() => onAccept(request.id)} className="w-full py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">Accept</button>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-light w-full">
                <div className="h-1 bg-primary transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
            </div>
             <div className="absolute top-2 right-2 text-xs font-bold text-primary bg-primary-light px-2 py-1 rounded-full">
                {timeLeft > 0 ? `${timeLeft}s` : '...'}
            </div>
        </div>
    )
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ currentUser, showToast, onUpdateDriverDetails }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [requests, setRequests] = useState<RideRequest[]>([]);
    const [earnings, setEarnings] = useState({ today: 0, trips: 0 });
    const [isPayoutsModalOpen, setIsPayoutsModalOpen] = useState(false);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

    const requestIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isOnline) {
            // Start generating new requests and cleaning up old ones
            requestIntervalRef.current = window.setInterval(() => {
                // Remove expired requests
                setRequests(prev => prev.filter(req => req.expiresAt > Date.now()));
                
                // Add a new request (with some randomness)
                if (Math.random() > 0.6) { // 40% chance to get a new request every 5 seconds
                    const newRequest = generateMockRideRequest();
                    console.log('SIMULATED PUSH NOTIFICATION: New ride request!', newRequest);
                    showToast(`New Ride: ${newRequest.pickup} to ${newRequest.dropoff}`);
                    setRequests(prev => [newRequest, ...prev]);
                }
            }, 5000);
        } else {
            // Stop generating requests when offline
            if (requestIntervalRef.current) {
                clearInterval(requestIntervalRef.current);
            }
            setRequests([]); // Clear all requests
        }

        return () => {
            if (requestIntervalRef.current) {
                clearInterval(requestIntervalRef.current);
            }
        };
    }, [isOnline, showToast]);
    
    const handleAccept = (id: string) => {
        const acceptedRequest = requests.find(r => r.id === id);
        if (acceptedRequest) {
            const fareValue = parseInt(acceptedRequest.fare.replace('₦', ''), 10);
            setEarnings(prev => ({
                today: prev.today + fareValue,
                trips: prev.trips + 1
            }));
            // In a real app, this would transition to an active ride screen
            showToast(`Ride accepted from ${acceptedRequest.pickup}!`);
            setRequests(prev => prev.filter(req => req.id !== id));
        }
    };
    
    const handleDecline = (id: string) => {
        setRequests(prev => prev.filter(req => req.id !== id));
    };

    const handleSavePayouts = (details: PayoutDetails) => {
        if (currentUser.driverDetails) {
            onUpdateDriverDetails({
                ...currentUser.driverDetails,
                payoutDetails: details,
            });
        }
        setIsPayoutsModalOpen(false);
        showToast("Payout details updated successfully!");
    };

    const handleSaveVehicle = (details: Omit<Required<User>['driverDetails'], 'payoutDetails'>) => {
         if (currentUser.driverDetails) {
            onUpdateDriverDetails({
                ...currentUser.driverDetails,
                ...details,
            });
        }
        setIsVehicleModalOpen(false);
        showToast("Vehicle details updated successfully!");
    };


    return (
        <div className="bg-gray-100 py-8 min-h-[calc(100vh-200px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary">Driver Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {currentUser.name.split(' ')[0]}!</p>
                    </div>
                     <div className="flex items-center space-x-3 flex-wrap">
                        <button onClick={() => setIsVehicleModalOpen(true)} className="px-4 py-2 text-sm font-medium text-primary bg-primary-light border border-primary/20 rounded-md hover:bg-green-200 transition-colors">
                            Manage Vehicle
                        </button>
                        <button onClick={() => setIsPayoutsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-primary bg-primary-light border border-primary/20 rounded-md hover:bg-green-200 transition-colors">
                            Manage Payouts
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold ${isOnline ? 'text-primary' : 'text-gray-500'}`}>
                              {isOnline ? 'You are Online' : 'You are Offline'}
                          </span>
                          <button
                              onClick={() => setIsOnline(!isOnline)}
                              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isOnline ? 'bg-primary' : 'bg-gray-300'}`}
                              role="switch"
                              aria-checked={isOnline}
                          >
                              <span
                                  aria-hidden="true"
                                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isOnline ? 'translate-x-5' : 'translate-x-0'}`}
                              />
                          </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats and Requests */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Today's Earnings</h3>
                                <p className="mt-1 text-2xl font-semibold text-primary">₦{earnings.today.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Trips Today</h3>
                                <p className="mt-1 text-2xl font-semibold text-secondary">{earnings.trips}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <p className={`mt-1 text-2xl font-semibold ${isOnline ? 'text-primary' : 'text-gray-500'}`}>{isOnline ? 'Online' : 'Offline'}</p>
                            </div>
                        </div>
                        
                        {/* Ride Requests */}
                        <div>
                            <h2 className="text-xl font-bold text-secondary mb-4">Available Requests</h2>
                            <div className="space-y-4">
                                {isOnline && requests.length > 0 && (
                                    requests.map(req => (
                                        <RideRequestCard key={req.id} request={req} onAccept={handleAccept} onDecline={handleDecline} />
                                    ))
                                )}
                                {isOnline && requests.length === 0 && (
                                    <div className="text-center bg-white p-10 rounded-lg shadow">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">Searching for rides...</h3>
                                        <p className="mt-1 text-sm text-gray-500">You'll be notified when a new request comes in.</p>
                                    </div>
                                )}
                                {!isOnline && (
                                    <div className="text-center bg-white p-10 rounded-lg shadow">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">You are offline</h3>
                                        <p className="mt-1 text-sm text-gray-500">Go online to start receiving ride requests.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Map */}
                    <div className="lg:col-span-1">
                         <MapView />
                    </div>
                </div>
            </div>
            {currentUser.driverDetails && (
                <>
                    <PayoutsModal 
                        isOpen={isPayoutsModalOpen}
                        onClose={() => setIsPayoutsModalOpen(false)}
                        onSave={handleSavePayouts}
                        currentDetails={currentUser.driverDetails.payoutDetails}
                    />
                    <VehicleModal
                        isOpen={isVehicleModalOpen}
                        onClose={() => setIsVehicleModalOpen(false)}
                        onSave={handleSaveVehicle}
                        currentDetails={currentUser.driverDetails}
                    />
                </>
            )}
        </div>
    );
};

export default DriverDashboard;