import { Router } from "express";
import {
  getTrips,
  createTrip,
} from "../controllers/trip";

const tripRoutes: Router = Router();

tripRoutes.get("/trip", getTrips);
tripRoutes.post("/trip", createTrip);

export default tripRoutes;