export const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === "production") {
    return process.env.PRODUCTION_URL!;
  }

  if (process.env.NODE_ENV === "development") {
    return process.env.TEST_URL || "http://localhost:8000";
  }

  return process.env.DEVELOPMENT_URL || "http://localhost:8000";
};
