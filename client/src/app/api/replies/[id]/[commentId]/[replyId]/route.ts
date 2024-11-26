import axios from "axios";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; replyId: string; commentId: string } }
) {
  const { id, commentId, replyId } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: "No slug found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/replies/${id}/${commentId}/${replyId}`
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string; replyId: string } }
) {
  const { id: postId, commentId, replyId } = params;
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("ids===>", postId, commentId, replyId);

  if (!token) {
    return new Response(JSON.stringify({ message: "No token found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/replies/${postId}/${commentId}/${replyId}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
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
