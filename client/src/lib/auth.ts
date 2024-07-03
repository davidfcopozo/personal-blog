import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { BadRequest } from "../../../api/src/errors/bad-request";
import axios from "axios";
const baseUrl = "http://localhost:3000/api";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new BadRequest("Email and password are required");
          }
          const res = await axios.post(`${baseUrl}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data;

          if (res.status === 200 && user) {
            return {
              id: user.id,
              email: credentials.email,
              role: user.role,
              accessToken: user.accessToken,
            };
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    verifyRequest: "/auth/verify-request",
    newUser: "/profile",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account && account.provider !== "credentials") {
          const res = await axios.post(`${baseUrl}/auth/oauth`, {
            provider: account.provider,
            email: user.email,
            name: user.name,
            avatar: user.image,
          });

          if (res.status === 200) {
            user.id = res.data.id;
            user.role = res.data.role;
            user.accessToken = res.data.accessToken;
            return true;
          }
        }
        return true;
      } catch (error: Error | any) {
        return `/login?error=${encodeURIComponent(
          error.response?.data?.message || "Sign-in failed"
        )}`;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
