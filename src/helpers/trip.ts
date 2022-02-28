import { TripsQueryFiltersAndOptions, TripQueryFilters, TripQueryOptions, Reading, Location } from "../types/trip";

export const getTripsQueryFiltersAndOptions = (filters: any): TripsQueryFiltersAndOptions => {
    
    const {start_gte: startGte, start_lte: startLte, distance_gte: distanceGte, limit, offset: skip} = filters;

    const queryFilters: TripQueryFilters = { "start.time": {}, distance: {}};

    const options:TripQueryOptions = { skip: parseInt(skip) || 0, limit: parseInt(limit) || 10};

    if(parseFloat(startGte)>=0 && queryFilters["start.time"]) queryFilters["start.time"].$gte = parseFloat(startGte);
    if(parseFloat(startLte)>=0 &&  queryFilters["start.time"]) queryFilters["start.time"].$lte = parseFloat(startLte);
    if(parseFloat(distanceGte)>=0 && queryFilters.distance) queryFilters.distance.$gte = parseFloat(distanceGte);

    if(queryFilters["start.time"] && Object.keys(queryFilters["start.time"]).length === 0) delete queryFilters["start.time"];
    if(queryFilters.distance && Object.keys(queryFilters.distance).length === 0) delete queryFilters.distance;

    return {queryFilters, options};
}

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};
  
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
  
export const findBoundingBoxForGivenCoordinates = (readings: any) =>{
  let west: number = 180;
  let east: number = -180;
  let north: number = -90;
  let south: number = 90;

  readings.forEach((reading: any) => {
    north = Math.max(reading.location.lat, north)
    south = Math.min(reading.location.lat, south)
    west = Math.min(reading.location.lon, west)
    east = Math.max(reading.location.lon, east)
  });

  return [{lat: south, lon: west}, {lat: north, lon: east}];
}