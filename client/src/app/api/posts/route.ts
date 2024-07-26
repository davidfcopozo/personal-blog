import axios from "axios";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/posts`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res: Response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/posts`,
      body
    );

    if (!res.ok) {
      throw new Error(res?.statusText);
    }

    return new Response(JSON.stringify(await res.json()), {
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
