import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getClientIP, getIPGeolocation } from "@/lib/ip-utils";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;

export async function POST(req: NextRequest) {
  try {
    const { email, token, password, baseUrl } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(req);
    const { geoLocation, isProxyOrVPN } = await getIPGeolocation(clientIP);

    const response = await axios.post(
      `${BASE_URL}/auth/reset-password?token=${token}`,
      {
        email,
        password,
        baseUrl,
        ipData: {
          geoLocation,
          isProxyOrVPN,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error(
      "Password reset error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: error.response?.data?.msg || "Failed to reset password" },
      { status: error.response?.status || 500 }
    );
  }
}
