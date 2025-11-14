
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
