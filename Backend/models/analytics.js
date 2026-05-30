import mongoose, { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },

    ip: String,

    country: String,

    city: String,

    device: String,

    browser: String,

    os: String,
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

export const analyticsModel = model("Analytics", analyticsSchema);
