
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import { BookingDetails, RideOption, CourierQuote } from './types';
import ResultsDisplay from './components/ResultsDisplay';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [results, setResults] = useState<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // New state for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<RideOption | CourierQuote | null>(null);

  const handleSearch = (details: BookingDetails) => {
    setBookingDetails(details);
    setResults(null); // Clear previous results
  };
  
  const handleReset = () => {
    setResults(null);
    setBookingDetails(null);
  };

  // New functions for modal
  const handleSelectOption = (option: RideOption | CourierQuote) => {
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would trigger an API call to finalize the booking
    alert('Booking Confirmed! Thank you for choosing NaijaGo.');
    handleCloseModal();
    handleReset(); // Go back to the main screen after confirmation
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
            onSelectOption={handleSelectOption}
          />
        )}
        <Features />
      </main>
      <Footer />
      {bookingDetails && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
          bookingDetails={bookingDetails}
          selectedOption={selectedOption}
        />
      )}
    </div>
  );
};

export default App;
