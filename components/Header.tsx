import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onAuthClick, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2">
              <svg className="h-8 w-auto text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C16.97 2 21 6.03 21 11C21 15.05 18.05 19.38 13.8 21.53C12.68 22.09 11.32 22.09 10.2 21.53C5.95 19.38 3 15.05 3 11C3 6.03 7.03 2 12 2ZM12 13.01C13.1 13.01 14 12.11 14 11.01C14 9.91 13.1 9.01 12 9.01C10.9 9.01 10 9.91 10 11.01C10 12.11 10.9 13.01 12 13.01Z"/>
              </svg>
              <span className="text-2xl font-extrabold text-primary">NaijaGo</span>
            </a>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <a href="#" className="font-medium text-gray-500 hover:text-primary transition-colors">Ride</a>
            <a href="#" className="font-medium text-gray-500 hover:text-primary transition-colors">Courier</a>
            <a href="#" className="font-medium text-gray-500 hover:text-primary transition-colors">Safety</a>
            <a href="#" className="font-medium text-gray-500 hover:text-primary transition-colors">Help</a>
          </nav>
          <div className="flex items-center">
             {currentUser ? (
               <div className="flex items-center space-x-4">
                 <span className="hidden sm:inline text-sm font-medium text-gray-600">Welcome, {currentUser.name.split(' ')[0]}!</span>
                 <button onClick={onLogout} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Log Out
                 </button>
               </div>
             ) : (
                <button onClick={onAuthClick} className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-green-200 transition-colors">
                    Sign In / Sign Up
                </button>
             )}
              <button className="md:hidden ml-4 p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;