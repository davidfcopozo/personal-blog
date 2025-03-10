import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  ImageDeletePayload,
  ImageDeleteResponse,
  ImageUpdatePayload,
  ImageUpdateResponse,
  ImageUploadPayload,
  ImageUploadResponse,
  ImagesListResponse,
} from "@/typings/api/images";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;
const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await axios.get<ImagesListResponse>(
      `${BASE_URL}/users/${id}/images`,
      {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data?.msg || "Failed to fetch images",
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ImageUploadPayload = await req.json();
    const response = await axios.post<ImageUploadResponse>(
      `${BASE_URL}/users/${id}/images`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const isDuplicateError =
      error.response?.status === 409 ||
      error.response?.data?.msg?.toLowerCase().includes("duplicate");

    if (isDuplicateError) {
      return NextResponse.json(
        {
          error: error.response?.data?.msg || "Duplicate image detected",
          isDuplicate: true,
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        error: error.response?.data?.msg || "Failed to store image metadata",
        details: error.response?.data,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In Vercel, URL parsing might work differently, so we need to be more robust
    let imageId;

    // Try multiple methods to get the imageId
    // Method 1: Check if it's in the query string
    const url = new URL(req.url);
    imageId = url.searchParams.get("id");

    // Method 2: Check the request headers in case it was passed that way
    if (!imageId) {
      const customHeader = req.headers.get("x-image-id");
      if (customHeader) {
        imageId = customHeader;
      }
    }

    // Method 3: Check for nextUrl property which might be available in Vercel
    if (!imageId && req.nextUrl) {
      imageId = req.nextUrl.searchParams.get("id");
    }

    // Debug logging
    console.log("[DELETE] Request URL:", req.url);
    console.log(
      "[DELETE] Search params:",
      Object.fromEntries(url.searchParams.entries())
    );
    console.log("[DELETE] Image ID extracted:", imageId);

    if (!imageId) {
      return NextResponse.json(
        { error: "No image ID provided" },
        { status: 400 }
      );
    }

    // Log the complete URL being sent to the backend
    const backendUrl = `${BASE_URL}/users/${id}/images/${imageId}`;
    console.log(`[DELETE] Calling backend API: ${backendUrl}`);

    const response = await axios.delete<ImageDeleteResponse>(backendUrl, {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "[DELETE] Error deleting image:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        error: error.response?.data?.msg || "Failed to delete image",
        details: error.response?.data,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageId, updates }: ImageUpdatePayload = await req.json();

    const response = await axios.patch<ImageUpdateResponse>(
      `${BASE_URL}/users/${id}/images`,
      {
        image: {
          _id: imageId,
          ...updates,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data?.msg || "Failed to update image metadata",
      },
      { status: error.response?.status || 500 }
    );
  }
}
