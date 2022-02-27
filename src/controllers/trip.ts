import { Response, Request } from "express";

const getTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("getTrips");
  } catch (error) {
    throw error;
  }
};

const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("createTrip");
  } catch (error) {
    throw error;
  }
};

export { createTrip, getTrips };