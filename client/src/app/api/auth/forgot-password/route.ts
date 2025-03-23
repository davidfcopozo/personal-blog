import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getClientIP, getIPGeolocation } from "@/lib/ip-utils";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_API_ENDPOINT;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const clientIP = getClientIP(req);
    const { geoLocation, isProxyOrVPN } = await getIPGeolocation(clientIP);

    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email,
      ipData: {
        ip: clientIP,
        geoLocation,
        isProxyOrVPN,
      },
      baseUrl: FRONTEND_URL,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Password reset error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        error:
          error.response?.data?.msg ||
          "Failed to process password reset request",
      },
      { status: error.response?.status || 500 }
    );
  }
}
