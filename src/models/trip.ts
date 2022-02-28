import { ITrip } from "../types/trip";
import { model, Schema } from "mongoose";

const tripPointSchema: Schema = new Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const boundinBoxSchema: Schema = new Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const tripSchema: Schema = new Schema(
  {
    start: {
      type: tripPointSchema,
      required: true,
    },
    end: {
      type: tripPointSchema,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    overspeedsCount: {
      type: Number,
      required: true,
    },
    boundingBox: {
      type: [boundinBoxSchema],
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model<ITrip>("trip", tripSchema);
