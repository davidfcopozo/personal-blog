export const getBaseUrl = (): string => {
  // For production environment
  if (process.env.NODE_ENV === "production") {
    return process.env.PRODUCTION_URL!;
  }

  // For testing environment
  if (process.env.NODE_ENV === "development") {
    return process.env.TEST_URL || "http://localhost:8000";
  }

  // Default to development environment
  return process.env.DEVELOPMENT_URL || "http://localhost:8000";
};
