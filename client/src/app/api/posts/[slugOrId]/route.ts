import axios from "axios";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { slugOrId: string } }
) {
  const { slugOrId } = params;

  if (!slugOrId) {
    return new Response(JSON.stringify({ message: "No slug found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/posts/${slugOrId}`
    );

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | any) {
    return new Response(
      JSON.stringify({
        message: error.response?.data?.msg || "Internal server error",
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slugOrId: string } }
) {
  const { slugOrId } = params;

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!slugOrId) {
    return new Response(JSON.stringify({ message: "No slug found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/posts/${slugOrId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | any) {
    console.error("Update post error:", error);

    return new Response(
      JSON.stringify({
        message: error.message || "Internal server error",
        details: error.response?.data || {},
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slugOrId: string } }
) {
  const { slugOrId } = params;

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!slugOrId) {
    return new Response(JSON.stringify({ message: "No slug found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/posts/${slugOrId}`,
      {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
        },
      }
    );

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | any) {
    console.error("Delete post error:", error);

    return new Response(
      JSON.stringify({
        message: error.message || "Internal server error",
        details: error.response?.data || {},
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
