import React, { useEffect } from 'react';

interface ToastNotificationProps {
    message: string;
    onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Auto-dismiss after 4 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 z-50 animate-slide-in-down">
            <div className="bg-secondary text-white rounded-lg shadow-2xl p-4 flex items-center space-x-3">
                <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="text-gray-300 hover:text-white">&times;</button>
            </div>
            <style>{`
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-in-down {
                    animation: slideInDown 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ToastNotification;
