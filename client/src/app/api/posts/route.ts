export async function GET() {
  try {
    const res = await fetch(`${process.env.BACKEND_API_ENDPOINT}/posts`);

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
