export enum ServiceType {
  Ride = 'ride',
  Courier = 'courier',
}

export interface RideOption {
  type: string;
  fare: string;
  eta: string;
  description: string;
  icon: 'car' | 'bike' | 'luxury';
}

export interface CourierQuote {
  fare: string;
  eta: string;
  description: string;
  trackingId: string;
}

export interface BookingDetails {
  service: ServiceType;
  pickup: string;
  dropoff: string;
  packageDetails?: string;
}

export interface DriverDetails {
  name: string;
  photoUrl: string;
  vehicle: string;
  licensePlate: string;
}

export interface User {
  name: string;
  email: string;
  role: 'user' | 'driver';
  driverDetails?: {
    vehicle: string;
    licensePlate: string;
  }
}