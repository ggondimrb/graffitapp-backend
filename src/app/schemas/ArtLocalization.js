import mongoose from "mongoose";
import PointSchema from "./PointSchema";

const ArtLocalizationSchema = new mongoose.Schema(
  {
    artist: {
      type: Number,
      required: true
    },
    art: {
      type: Number,
      required: true
    },
    location: {
      type: PointSchema,
      index: "2dsphere" // index padrao para geolocalizacao
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("ArtLocalization", ArtLocalizationSchema);
