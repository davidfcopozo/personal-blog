import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;

export async function POST(req: NextRequest) {
  try {
    const { email, token, baseUrl } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${BASE_URL}/auth/verify-reset-token?token=${token}`,
      { email, baseUrl }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error(
      "Token verification error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: error.response?.data?.msg || "Invalid or expired token" },
      { status: error.response?.status || 500 }
    );
  }
}
