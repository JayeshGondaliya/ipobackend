export function errorHandler(error, req, res, next) {
  const status = error.response?.status
    || (error.response ? 502 : 500);

  const providerData = error.response?.data;

  console.error("IPO API request failed:", {
    status,
    code: providerData?.error || error.code || "unknown_error",
  });

  res.status(status).json({
    success: false,
    message:
      providerData?.message ||
      "Unable to retrieve IPO data. Please try again later.",
    error:
      providerData?.error ||
      (error.code === "ECONNABORTED"
        ? "request_timeout"
        : "api_request_failed"),
    ...(providerData?.required_scope && {
      required_scope: providerData.required_scope,
    }),
    ...(providerData?.retry_after && {
      retry_after: providerData.retry_after,
    }),
  });
}