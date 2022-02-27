import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { MONGODB_URL } from "./config/db";

const app = express();

const PORT: string | number = process.env.NODE_LOCAL_PORT || 4000;

app.use(cors());
app.use(express.json());

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
