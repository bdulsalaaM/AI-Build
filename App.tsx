
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import { BookingDetails, RideOption, CourierQuote } from './types';
import ResultsDisplay from './components/ResultsDisplay';

const App: React.FC = () => {
  const [results, setResults] = useState<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const handleSearch = (details: BookingDetails) => {
    setBookingDetails(details);
    setResults(null); // Clear previous results
  };
  
  const handleReset = () => {
    setResults(null);
    setBookingDetails(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-secondary">
      <Header />
      <main>
        <Hero onSearch={handleSearch} setIsLoading={setIsLoading} setResults={setResults} isShowingResults={!!results} />
        {bookingDetails && (
          <ResultsDisplay 
            bookingDetails={bookingDetails} 
            results={results} 
            isLoading={isLoading} 
            onReset={handleReset} 
          />
        )}
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default App;
