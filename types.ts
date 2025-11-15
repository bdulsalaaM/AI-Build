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
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface DriverDetails {
  name: string;
  photoUrl: string;
  vehicle: string;
  licensePlate: string;
}

export interface PayoutDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface User {
  name: string;
  email: string;
  role: 'user' | 'driver';
  driverDetails?: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    licensePlate: string;
    payoutDetails?: PayoutDetails;
  }
}

export interface RideHistoryItem {
  id: string;
  date: string;
  service: 'ride' | 'courier';
  pickup: string;
  dropoff: string;
  fare: string;
  // Ride specific
  driverName?: string;
  rideType?: string;
  // Courier specific
  trackingId?: string;
}

export type CourierStatus = 'Confirmed' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface RideRequest {
  id: string;
  pickup: string;
  dropoff: string;
  fare: string;
  expiresAt: number; // timestamp
}