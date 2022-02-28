import { Document } from "mongoose";

export interface ITrip extends Document {
  start: TripPoint;
  end: TripPoint;
  distance: number;
  duration: number;
  overspeedsCount: number;
  boundingBox: Location[];
}

export interface Location {
  lat: number;
  lon: number;
}

export interface Reading {
  time: number;
  speed: number;
  speedLimit: number;
  location: Location;
}

export interface TripPoint extends Location {
  time: number;
  address: string;
}

export interface TripQueryOptions {
  skip: number;
  limit: number;
}

export interface TripQueryFilters {
  "start.time"?: {
    $gte?: number;
    $lte?: number;
  };
  distance?: {
    $gte?: number;
  };
}

export interface TripsQueryFiltersAndOptions{
  queryFilters: TripQueryFilters,
  options: TripQueryOptions
}
