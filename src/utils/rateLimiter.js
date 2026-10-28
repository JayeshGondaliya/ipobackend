import ApiUsage from "../models/ApiUsage.js";

const DAILY_LIMIT = Number(
  process.env.APP_DAILY_API_LIMIT || 230
);

const MINUTE_LIMIT = Number(
  process.env.APP_MINUTE_API_LIMIT || 8
);

function getISTParts() {
  const istDate = new Date(Date.now() + 330 * 60 * 1000);
  const iso = istDate.toISOString();

  return {
    day: iso.slice(0, 10),
    minute: iso.slice(0, 16),
  };
}

async function reserveSlot(key, limit) {
  try {
    const now = new Date();

    const record = await ApiUsage.findOneAndUpdate(
      {
        _id: key,
        count: { $lt: limit },
      },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return Boolean(record);
  } catch (error) {
    // Existing counter has already reached its limit.
    if (error.code === 11000) {
      return false;
    }

    // If MongoDB cannot check the quota, fail closed.
    throw error;
  }
}

export async function reserveApiRequest() {
  const { day, minute } = getISTParts();

  const dailyAllowed = await reserveSlot(
    `daily:${day}`,
    DAILY_LIMIT
  );

  if (!dailyAllowed) {
    const error = new Error(
      "Application daily API safety limit reached."
    );

    error.status = 429;
    error.code = "local_daily_limit";

    throw error;
  }

  const minuteAllowed = await reserveSlot(
    `minute:${minute}`,
    MINUTE_LIMIT
  );

  if (!minuteAllowed) {
    const error = new Error(
      "Application per-minute API safety limit reached."
    );

    error.status = 429;
    error.code = "local_minute_limit";

    throw error;
  }
}