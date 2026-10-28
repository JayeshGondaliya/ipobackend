import mongoose from "mongoose";

const apiCacheSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    fetchedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApiCache = mongoose.model("ApiCache", apiCacheSchema);

export default ApiCache;