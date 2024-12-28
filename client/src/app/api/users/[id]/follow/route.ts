import axios from "axios";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "User does't exist or has been removed",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/users/${id}/follow`,
      body,
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
  } catch (error: any) {
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
