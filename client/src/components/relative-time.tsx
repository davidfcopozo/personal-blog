import { getRelativeTime } from "@/utils/formats";
import { useState, useEffect } from "react";

const RelativeTime = ({ createdAt }: { createdAt: Date | number }) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(createdAt));

  useEffect(() => {
    // Update the relative time every minute
    const intervalId = setInterval(() => {
      setRelativeTime(getRelativeTime(createdAt));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [createdAt]);

  return <span>{relativeTime}</span>;
};

export default RelativeTime;
