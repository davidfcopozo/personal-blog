import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await axios.post(
      `${process.env.BACKEND_API_ENDPOINT}/auth/oauth`,
      body
    );

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | any) {
    /* console.error(
      "OAuth Next.JS ERROR:",
      error.response?.data || error.message || error
    ); */
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
