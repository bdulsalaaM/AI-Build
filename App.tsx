import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import { BookingDetails, RideOption, CourierQuote, DriverDetails, User, RideHistoryItem } from './types';
import ResultsDisplay from './components/ResultsDisplay';
import ConfirmationModal from './components/ConfirmationModal';
import ActiveRideDisplay from './components/ActiveRideDisplay';
import { fetchDriverDetails } from './functions/api';
import AuthModal from './components/AuthModal';
import RideHistoryModal from './components/RideHistoryModal';
import ActiveCourierDisplay from './components/ActiveCourierDisplay';
import ScheduledRideConfirmation from './components/ScheduledRideConfirmation';
import DriverDashboard from './components/DriverDashboard';
import ToastNotification from './components/ToastNotification';

const App: React.FC = () => {
  const [results, setResults] = useState<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<RideOption | CourierQuote | null>(null);
  
  // Active states
  const [activeRide, setActiveRide] = useState<RideOption | null>(null);
  const [activeCourier, setActiveCourier] = useState<CourierQuote | null>(null);
  const [scheduledRide, setScheduledRide] = useState<{ booking: BookingDetails; ride: RideOption } | null>(null);
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [isFetchingDriver, setIsFetchingDriver] = useState<boolean>(false);

  // Auth and History state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [history, setHistory] = useState<RideHistoryItem[]>([]);

  // Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000); // Hide after 4 seconds
  };


  const handleSearch = (details: BookingDetails) => {
    setBookingDetails(details);
    setResults(null); 
  };
  
  const handleReset = () => {
    setResults(null);
    setBookingDetails(null);
    setActiveRide(null);
    setActiveCourier(null);
    setScheduledRide(null);
    setDriverDetails(null);
  };

  const handleEndRide = (rating: number, comments: string) => {
    if (activeRide && bookingDetails && driverDetails) {
      console.log(`Ride ended with rating: ${rating} stars and comments: "${comments}"`);
      const newHistoryItem: RideHistoryItem = {
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        service: 'ride',
        pickup: bookingDetails.pickup,
        dropoff: bookingDetails.dropoff,
        fare: activeRide.fare,
        driverName: driverDetails.name,
        rideType: activeRide.type,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    }
    handleReset();
  };

  const handleEndCourier = () => {
    if (activeCourier && bookingDetails) {
        const newHistoryItem: RideHistoryItem = {
            id: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            service: 'courier',
            pickup: bookingDetails.pickup,
            dropoff: bookingDetails.dropoff,
            fare: activeCourier.fare,
            trackingId: activeCourier.trackingId,
        };
        setHistory(prev => [newHistoryItem, ...prev]);
    }
    handleReset();
  }


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
    if (!selectedOption || !bookingDetails) return;
    
    // Check if it's a scheduled ride
    if (bookingDetails.scheduledDate && bookingDetails.scheduledTime && 'type' in selectedOption) {
      setScheduledRide({ booking: bookingDetails, ride: selectedOption as RideOption });
      setResults(null);
      handleCloseConfirmModal();
      return;
    }

    if ('type' in selectedOption) { // It's a RideOption
      const ride = selectedOption as RideOption;
      setActiveRide(ride);
      setResults(null);
      setIsFetchingDriver(true);
      try {
        const details = await fetchDriverDetails();
        setDriverDetails(details);
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
      } finally {
        setIsFetchingDriver(false);
      }
    } else { // It's a CourierQuote
        const courier = selectedOption as CourierQuote;
        setActiveCourier(courier);
        setResults(null);
    }
    handleCloseConfirmModal();
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHistory([]);
    handleReset(); // Also reset any active booking state
  };

  const handleUpdateDriverDetails = (details: User['driverDetails']) => {
    if (currentUser && currentUser.role === 'driver') {
        setCurrentUser({
            ...currentUser,
            driverDetails: details,
        });
    }
  };

  const isShowingContent = !!results || !!activeRide || !!activeCourier || !!scheduledRide;

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-secondary">
      <Header 
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onHistoryClick={() => setIsHistoryModalOpen(true)}
      />
      <main>
        {currentUser?.role === 'driver' ? (
          <DriverDashboard 
            currentUser={currentUser} 
            showToast={showToast}
            onUpdateDriverDetails={handleUpdateDriverDetails}
          />
        ) : (
          <>
            <Hero 
                onSearch={handleSearch} 
                setIsLoading={setIsLoading} 
                setResults={setResults} 
                isShowingResults={isShowingContent} 
            />
            {bookingDetails && !activeRide && !activeCourier && !scheduledRide && (
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
                    onEndRide={handleEndRide}
                />
            )}
            {bookingDetails && activeCourier && (
                <ActiveCourierDisplay
                    courier={activeCourier}
                    bookingDetails={bookingDetails}
                    onEndCourier={handleEndCourier}
                />
            )}
            {scheduledRide && (
                <ScheduledRideConfirmation
                    details={scheduledRide}
                    onDone={handleReset}
                />
            )}
            {!isShowingContent && <Features />}
          </>
        )}
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
      <RideHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />
      {toastMessage && <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;