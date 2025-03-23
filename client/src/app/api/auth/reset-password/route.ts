import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${BASE_URL}/auth/reset-password?token=${token}`,
      {
        email,
        password,
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
