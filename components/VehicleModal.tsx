import React, { useState, useEffect } from 'react';
import { User } from '../types';

type VehicleDetails = Omit<Required<User>['driverDetails'], 'payoutDetails'>;

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: VehicleDetails) => void;
  currentDetails?: VehicleDetails;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ isOpen, onClose, onSave, currentDetails }) => {
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentDetails) {
      setVehicleMake(currentDetails.vehicleMake || '');
      setVehicleModel(currentDetails.vehicleModel || '');
      setVehicleYear(currentDetails.vehicleYear || '');
      setLicensePlate(currentDetails.licensePlate || '');
    }
  }, [currentDetails]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!vehicleMake || !vehicleModel || !vehicleYear || !licensePlate) {
      setError('All fields are required.');
      return;
    }
    if (!/^\d{4}$/.test(vehicleYear) || parseInt(vehicleYear) > new Date().getFullYear() || parseInt(vehicleYear) < 1990) {
        setError('Please enter a valid year (e.g., 2018).');
        return;
    }
    onSave({ vehicleMake, vehicleModel, vehicleYear, licensePlate });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-bold text-secondary">Manage Vehicle</h3>
                <p className="text-sm text-gray-500">Update your vehicle information.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
                <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">Vehicle Make</label>
                <input
                    type="text"
                    id="vehicleMake"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="e.g., Toyota"
                    required
                />
            </div>
            <div>
                <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                <input
                    type="text"
                    id="vehicleModel"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="e.g., Camry"
                    required
                />
            </div>
            <div>
                <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700">Year</label>
                <input
                    type="number"
                    id="vehicleYear"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="e.g., 2018"
                    required
                />
            </div>
            <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate</label>
                <input
                    type="text"
                    id="licensePlate"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4"
                    placeholder="e.g., LSD 123AB"
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            Save Changes
          </button>
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

export default VehicleModal;