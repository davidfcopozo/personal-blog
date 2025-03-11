import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, password, username } = data;

    if (!firstName || !lastName || !email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const response = await axios.post(`${BASE_URL}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
      username,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);

    if (error.response?.status === 409) {
      return NextResponse.json(
        { error: error.response.data.msg || "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.response?.data?.msg || "Failed to register user" },
      { status: error.response?.status || 500 }
    );
  }
}
