import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

type Mode = 'signin' | 'signup';
type Role = 'user' | 'driver';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<Mode>('signup');
  const [role, setRole] = useState<Role>('user');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (mode === 'signup' && (!name || !phone)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && role === 'driver' && (!vehicleMake || !vehicleModel || !vehicleYear || !licensePlate)) {
        setError('All vehicle details are required for drivers.');
        return;
    }

    // Simulate successful auth
    const user: User = {
      name: name || 'Demo Driver', // Use a placeholder for signin
      email,
      role,
      driverDetails: role === 'driver' ? { vehicleMake, vehicleModel, vehicleYear, licensePlate } : undefined
    };
    onLoginSuccess(user);
  };
  
  const isSignUp = mode === 'signup';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-secondary">{isSignUp ? 'Create an Account' : 'Sign In'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <div className="flex border-b border-gray-200 mt-4">
            <button
              onClick={() => setRole('user')}
              className={`flex-1 py-2 text-sm font-bold focus:outline-none transition-colors ${role === 'user' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              I'm a User
            </button>
            <button
              onClick={() => setRole('driver')}
              className={`flex-1 py-2 text-sm font-bold focus:outline-none transition-colors ${role === 'driver' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              I'm a Driver
            </button>
          </div>
          <form onSubmit={handleAuthAction} className="mt-6 space-y-4">
            {isSignUp && (
              <>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
              </>
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
            
            {isSignUp && role === 'driver' && (
              <div className="p-4 bg-gray-50 rounded-md space-y-3">
                 <p className="text-sm font-medium text-gray-600">Driver Details</p>
                 <input type="text" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} placeholder="Vehicle Make (e.g., Toyota)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
                 <input type="text" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="Vehicle Model (e.g., Camry)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
                 <input type="text" value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} placeholder="Vehicle Year (e.g., 2018)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
                 <input type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} placeholder="License Plate (e.g., LSD 123AB)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"/>
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-gray-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button type="button" onClick={() => setMode(isSignUp ? 'signin' : 'signup')} className="font-medium text-primary hover:text-primary-dark ml-1">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
          </form>
        </div>
      </div>
       <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;