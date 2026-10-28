export function errorHandler(error, req, res, next) {
  const status =
    error.status ||
    error.response?.status ||
    (error.response ? 502 : 500);

  const providerData = error.response?.data;

  console.error("IPO API request failed:", {
    status,
    code: providerData?.error || error.code || "unknown_error",
  });

  res.status(status).json({
    success: false,

    message:
      providerData?.message ||
      (status === 429
        ? "API request limit reached. Please try again later."
        : "Unable to retrieve IPO data. Please try again later."),

    error:
      providerData?.error ||
      error.code ||
      (status === 429 ? "rate_limited" : "api_request_failed"),

    ...(providerData?.required_scope && {
      required_scope: providerData.required_scope,
    }),

    ...(providerData?.retry_after && {
      retry_after: providerData.retry_after,
    }),
  });
}