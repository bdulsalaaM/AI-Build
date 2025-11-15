
import React from 'react';
import BookingForm from './BookingForm';
import { BookingDetails, RideOption, CourierQuote } from '../types';

interface HeroProps {
  onSearch: (details: BookingDetails) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResults: React.Dispatch<React.SetStateAction<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote; } | null>>;
  isShowingResults: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, setIsLoading, setResults, isShowingResults }) => {
  return (
    <div className="relative bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
       <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-secondary sm:text-5xl md:text-6xl">
            <span className="block">Your City, Your Ride,</span>
            <span className="block text-primary">Delivered Fast.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            The reliable, safe, and lightning-fast way to move around and send packages within Nigeria. Let's get you going.
          </p>
        </div>
        <div className={`mt-12 max-w-lg mx-auto transition-all duration-500 ${isShowingResults ? 'opacity-0 max-h-0' : 'opacity-100 max-h-screen'}`}>
            <BookingForm onSearch={onSearch} setIsLoading={setIsLoading} setResults={setResults} />
        </div>
      </div>
    </div>
  );
};

export default Hero;