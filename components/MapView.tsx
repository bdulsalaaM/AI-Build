import React from 'react';

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" fill="white" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

// Simulated locations for other drivers
const driverLocations = [
  { top: '15%', left: '20%' },
  { top: '30%', left: '60%' },
  { top: '50%', left: '30%' },
  { top: '70%', left: '75%' },
  { top: '85%', left: '40%' },
];

const MapView: React.FC = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow h-full">
            <h2 className="text-xl font-bold text-secondary mb-4">Live Driver Map</h2>
            <div className="relative w-full h-96 bg-gray-200 rounded-md overflow-hidden">
                {/* Background Map SVG */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Major Roads */}
                    <path d="M 10 0 V 400" stroke="#a5b4fc" strokeWidth="3" />
                    <path d="M 0 150 H 400" stroke="#a5b4fc" strokeWidth="3" />
                    <path d="M 80 0 V 400" stroke="#c7d2fe" strokeWidth="2" />
                    <path d="M 0 300 H 400" stroke="#c7d2fe" strokeWidth="2" />
                    <path d="M 250 0 V 400" stroke="#c7d2fe" strokeWidth="2" />
                </svg>

                {/* Driver Icons */}
                {driverLocations.map((loc, index) => (
                    <div key={index} className="absolute transform -translate-x-1/2 -translate-y-full" style={{ top: loc.top, left: loc.left }}>
                        <MapPinIcon className="h-6 w-6 text-secondary animate-pulse" />
                    </div>
                ))}

                 {/* Current Driver's Icon */}
                 <div className="absolute transform -translate-x-1/2 -translate-y-full" style={{ top: '50%', left: '50%' }}>
                    <div className="relative">
                        <MapPinIcon className="h-8 w-8 text-primary" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-dark"></span>
                        </span>
                    </div>
                </div>
            </div>
             <p className="text-xs text-center text-gray-500 mt-2">A simulated view of online drivers in your area.</p>
        </div>
    );
};

export default MapView;