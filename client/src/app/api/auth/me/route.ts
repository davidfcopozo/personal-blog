import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import axios from "axios";

// Request deduplication cache
const pendingRequests = new Map<string, Promise<any>>();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    if (pendingRequests.has(userId)) {
      const existingRequest = pendingRequests.get(userId);
      const result = await existingRequest;
      return NextResponse.json(result, { status: 200 });
    }

    // Create new request and cache the promise
    const requestPromise = axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/users/${userId}`)
      .then((res) => {
        // Remove from cache after completion
        pendingRequests.delete(userId);
        return res.data;
      })
      .catch((error) => {
        // Remove from cache on error too
        pendingRequests.delete(userId);
        throw error;
      });

    pendingRequests.set(userId, requestPromise);
    const result = await requestPromise;

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
