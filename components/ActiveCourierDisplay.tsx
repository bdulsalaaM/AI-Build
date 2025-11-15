import React, { useState, useEffect } from 'react';
import { CourierQuote, BookingDetails, CourierStatus } from '../types';

const statuses: CourierStatus[] = ['Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

const StatusIcon: React.FC<{ status: CourierStatus, isActive: boolean, isCompleted: boolean }> = ({ status, isActive, isCompleted }) => {
    const getIcon = () => {
        switch (status) {
            case 'Confirmed': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
            case 'Picked Up': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 16.5 19 21l-2.5-2.5"/><path d="m13.5 7.5-5 5"/><path d="M21 11V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11l5-5a2 2 0 0 1 2 0l2 2"/><path d="M14 21h4a2 2 0 0 0 2-2v-2l-5-5-2 2-1.5-1.5"/></svg>;
            case 'In Transit': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v10"/><path d="m16 6-8 4 8 4"/></svg>;
            case 'Out for Delivery': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.5 19.5 12 22 15"/><path d="m2 14 3-3 3 3"/><path d="M3 21h18"/><path d="M6 18h.01"/><path d="M7 15h10v-4.48a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 7 10.52V15Z"/><path d="M18 18h.01"/></svg>;
            case 'Delivered': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
        }
    };

    const baseClasses = "h-8 w-8 transition-colors duration-300";
    const activeClasses = "text-primary";
    const completedClasses = "text-white bg-primary";
    const inactiveClasses = "text-gray-400";
    
    const circleClasses = `rounded-full flex items-center justify-center p-2 transition-all duration-300 ${
        isCompleted ? 'bg-primary' : 'bg-gray-100'
    }`;

    return (
        <div className={circleClasses}>
           {React.cloneElement(getIcon(), { className: `${baseClasses} ${isActive ? activeClasses : isCompleted ? 'text-white' : inactiveClasses}` })}
        </div>
    );
};


interface ActiveCourierDisplayProps {
    courier: CourierQuote;
    bookingDetails: BookingDetails;
    onEndCourier: () => void;
}

const ActiveCourierDisplay: React.FC<ActiveCourierDisplayProps> = ({ courier, bookingDetails, onEndCourier }) => {
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

    useEffect(() => {
        if (currentStatusIndex < statuses.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStatusIndex(prev => prev + 1);
            }, 3000); // 3 seconds for simulation
            return () => clearTimeout(timer);
        }
    }, [currentStatusIndex]);

    const isDelivered = statuses[currentStatusIndex] === 'Delivered';

    return (
        <div className="bg-primary-light py-12">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-secondary">Package In Transit</h3>
                        <p className="text-sm text-gray-500">
                           Tracking ID: <span className="font-mono text-primary bg-primary-light px-2 py-1 rounded">{courier.trackingId}</span>
                        </p>
                    </div>

                    <div className="relative pl-4">
                        {statuses.map((status, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isActive = index === currentStatusIndex;

                            return (
                                <div key={status} className="flex items-start mb-8 last:mb-0">
                                    <div className="flex flex-col items-center mr-4">
                                        <StatusIcon status={status} isActive={isActive} isCompleted={isCompleted} />
                                        {index < statuses.length - 1 && (
                                            <div className={`w-0.5 h-16 transition-colors duration-500 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <p className={`font-bold transition-colors duration-300 ${isActive || isCompleted ? 'text-secondary' : 'text-gray-400'}`}>
                                            {status}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {isActive && 'Updating now...'}
                                            {isCompleted && 'Completed'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t">
                         <button 
                            onClick={onEndCourier}
                            disabled={!isDelivered}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                           {isDelivered ? 'Complete & New Search' : 'Waiting for Delivery...'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveCourierDisplay;