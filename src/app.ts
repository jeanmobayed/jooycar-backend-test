import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { MONGODB_URL } from "./config/db";
import tripRoutes from "./routes/trip";

const app = express();

const PORT: string | number = process.env.APPLICATION_PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(tripRoutes);

mongoose
  .connect(MONGODB_URL)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch((error) => {
    throw error;
  });
