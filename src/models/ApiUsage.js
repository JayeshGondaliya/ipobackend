import mongoose from "mongoose";

const apiUsageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },

  count: {
    type: Number,
    default: 0,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

apiUsageSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const ApiUsage = mongoose.model("ApiUsage", apiUsageSchema);

export default ApiUsage;