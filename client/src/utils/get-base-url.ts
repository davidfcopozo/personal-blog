const getBaseURL = () => {
  // For server-side rendering or build-time
  if (typeof window === "undefined") {
    return (
      process.env.NEXT_PUBLIC_FRONTEND_API_ENDPOINT || "http://localhost:3000"
    );
  }

  // For client-side
  return window.location.origin;
};

export default getBaseURL;
