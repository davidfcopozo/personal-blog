import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const searchParams = new URL(req.url).searchParams;
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${BASE_URL}/auth/verify-email?token=${token}`,
      { email }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "Email verification error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        error: error.response?.data?.msg || "Failed to verify email",
      },
      { status: error.response?.status || 500 }
    );
  }
}
