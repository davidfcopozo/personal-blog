import axios from "axios";
import { NextRequest } from "next/server";

const baseUrl = "http://localhost:8000/api/v1";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await axios.post(`${baseUrl}/auth/login`, body);

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
