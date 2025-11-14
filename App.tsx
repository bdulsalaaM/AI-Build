import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import { BookingDetails, RideOption, CourierQuote, DriverDetails, User } from './types';
import ResultsDisplay from './components/ResultsDisplay';
import ConfirmationModal from './components/ConfirmationModal';
import ActiveRideDisplay from './components/ActiveRideDisplay';
import { fetchDriverDetails } from './services/geminiService';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [results, setResults] = useState<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<RideOption | CourierQuote | null>(null);
  
  // Active ride state
  const [activeRide, setActiveRide] = useState<RideOption | null>(null);
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [isFetchingDriver, setIsFetchingDriver] = useState<boolean>(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const handleSearch = (details: BookingDetails) => {
    setBookingDetails(details);
    setResults(null); 
  };
  
  const handleReset = () => {
    setResults(null);
    setBookingDetails(null);
    setActiveRide(null);
    setDriverDetails(null);
  };

  const handleSelectOption = (option: RideOption | CourierQuote) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedOption(option);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedOption(null);
  };

  const handleConfirmBooking = async () => {
    if (selectedOption && 'icon' in selectedOption) {
      const ride = selectedOption as RideOption;
      setActiveRide(ride);
      setResults(null); 
      setIsFetchingDriver(true);
      try {
        const details = await fetchDriverDetails();
        setDriverDetails(details);
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
        // Handle error case, maybe show a message
      } finally {
        setIsFetchingDriver(false);
      }
    } else {
      alert('Booking Confirmed! Thank you for choosing NaijaGo.');
      handleReset();
    }
    handleCloseConfirmModal();
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleReset(); // Also reset any active booking state
  };

  const isShowingContent = !!results || !!activeRide;

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-secondary">
      <Header 
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main>
        <Hero 
            onSearch={handleSearch} 
            setIsLoading={setIsLoading} 
            setResults={setResults} 
            isShowingResults={isShowingContent} 
        />
        {bookingDetails && !activeRide && (
          <ResultsDisplay 
            bookingDetails={bookingDetails} 
            results={results} 
            isLoading={isLoading} 
            onReset={handleReset} 
            onSelectOption={handleSelectOption}
          />
        )}
        {bookingDetails && activeRide && (
            <ActiveRideDisplay 
                ride={activeRide}
                bookingDetails={bookingDetails}
                driverDetails={driverDetails}
                isFetchingDriver={isFetchingDriver}
                onEndRide={handleReset}
            />
        )}
        {!isShowingContent && <Features />}
      </main>
      <Footer />
      {bookingDetails && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmBooking}
          bookingDetails={bookingDetails}
          selectedOption={selectedOption}
        />
      )}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;