import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT ||
  "http://localhost:8000/api/v1";

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
