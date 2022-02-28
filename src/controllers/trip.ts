import { Response, Request } from "express";
import nodeGeocoder, { OpenStreetMapOptions } from "node-geocoder";
import { ITrip } from "../types/trip";
import Trip from "../models/trip";
import { Reading } from "../types/trip";
import {
  getTripsQueryFiltersAndOptions,
  getDistanceFromLatLonInKm,
  findBoundingBoxForGivenCoordinates,
} from "../helpers/trip";

const options: OpenStreetMapOptions = {
  provider: "openstreetmap",
};

const geoCoder = nodeGeocoder(options);

const getTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const { queryFilters, options } = getTripsQueryFiltersAndOptions(req.query);

    const trips: ITrip[] = await Trip.find(queryFilters, null, options);

    res.status(200).json({ trips });
  } catch (error) {
    throw error;
  }
};

const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const readings = req.body.readings as Reading[];

    if (readings.length < 5)
      throw {status: 422 , message: "There must be at least 5 readings to create a new Trip."};

    let previouslyOverspeed: boolean = false;
    let overspeedsCount: number = 0;
    let totalDistance: number = 0;

    readings.forEach((reading, index) => {
      if (!reading.time)
        throw {status: 422 , message: "Each reading must have a 'time' property."};

      let isCurrentlyOverspeed = reading.speed > reading.speedLimit;

      if (isCurrentlyOverspeed && !previouslyOverspeed) overspeedsCount++;

      previouslyOverspeed = isCurrentlyOverspeed;

      if (index > 0)
        totalDistance += getDistanceFromLatLonInKm(
          readings[index - 1].location.lat,
          readings[index - 1].location.lon,
          reading.location.lat,
          reading.location.lon
        );
    });

    const sortedReadings = readings.sort((a: any, b: any) => a.time - b.time);

    const startReading = sortedReadings[0];
    const endReading = sortedReadings[sortedReadings.length - 1];

    const startReadingAdDressPromise = geoCoder.reverse({
      lat: startReading.location.lat,
      lon: startReading.location.lon,
    });

    const endReadingAddressPromise = geoCoder.reverse({
      lat: endReading.location.lat,
      lon: endReading.location.lon,
    });

    const [startReadingAddress, endReadingAddress] = await Promise.all([
      startReadingAdDressPromise,
      endReadingAddressPromise,
    ]);

    const trip: ITrip = new Trip({
      start: {
        time: startReading.time,
        lat: startReading.location.lat,
        lon: startReading.location.lon,
        address: startReadingAddress[0].formattedAddress,
      },
      end: {
        time: endReading.time,
        lat: endReading.location.lat,
        lon: endReading.location.lon,
        address: endReadingAddress[0].formattedAddress,
      },
      distance: Math.round((totalDistance + Number.EPSILON) * 100) / 100,
      duration: endReading.time - startReading.time,
      overspeedsCount,
      boundingBox: findBoundingBoxForGivenCoordinates(sortedReadings),
    });

    const newTrip: ITrip = await trip.save();

    res.status(200).json(newTrip);
  } catch (error: any) {
    res.status(error.status).json({"error": error.message});
  }
};

export { createTrip, getTrips };
