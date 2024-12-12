import { getRelativeTime } from "@/utils/formats";
import { useState, useEffect } from "react";

const RelativeTime = ({ createdAt }: { createdAt: Date | number }) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(createdAt));

  useEffect(() => {
    // Calculate the time difference in seconds
    const now = new Date();
    const past = createdAt instanceof Date ? createdAt : new Date(createdAt);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    // Determine the appropriate update interval
    let updateInterval: number;
    if (diffInSeconds < 3600) {
      // Less than an hour
      updateInterval = 60000; // Update every minute
    } else if (diffInSeconds < 86400) {
      // Less than a day
      updateInterval = 3600000; // Update every hour
    } else if (diffInSeconds < 2592000) {
      // Less than a month
      updateInterval = 86400000; // Update every day
    } else {
      updateInterval = 2592000000; // Update every month
    }

    const intervalId = setInterval(() => {
      setRelativeTime(getRelativeTime(createdAt));
    }, updateInterval);

    // Initial immediate update
    const timeoutId = setTimeout(() => {
      setRelativeTime(getRelativeTime(createdAt));
    }, 0);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [createdAt]);

  return <span>{relativeTime}</span>;
};

export default RelativeTime;