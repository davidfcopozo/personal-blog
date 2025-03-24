import { GeoLocationResponse } from "@/typings/interfaces";

export async function getIPGeolocation(ip: string): Promise<{
  geoLocation: string;
  isProxyOrVPN: boolean;
}> {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,city,regionName,proxy,hosting`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );

    const data: GeoLocationResponse = await response.json();

    if (data.status !== "success") {
      throw new Error("Failed to get geolocation data");
    }

    const isProxyOrVPN = data.proxy || data.hosting;

    const geoLocation = `${data.city}, ${data.regionName}, ${data.country}`;

    return {
      geoLocation,
      isProxyOrVPN,
    };
  } catch (error) {
    console.error("Error fetching IP geolocation:", error);
    return {
      geoLocation: "Unknown location",
      isProxyOrVPN: false,
    };
  }
}

export function getClientIP(req: Request): string {
  // Try to get IP from standard headers
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, we need the first one
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback value if we can't determine the IP
  return "127.0.0.1";
}
