import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../lib/mongodb";
import { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";
import { BadRequest } from "../../../api/src/errors/bad-request";
import axios from "axios";
const baseUrl = "http://localhost:3000/api";

export const authOptions: NextAuthOptions = {
  /*   adapter: MongoDBAdapter(clientPromise) as Adapter, */
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
          /* console.log("***RESPONSE*** FROM LIB/AUTH===>", res); */

          const user = res.data;
          console.log("***USER*** FROM LIB/AUTH===>", user);

          if (res.status === 200 && user) {
            // Return the user object with the token
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
          console.log("ERROR FROM LIB/AUTH===>", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/profile",
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
      credentials,
    }): Promise<string | boolean> {
      /*  console.log(
        "************FROM CALLBACKS SIGN IN************",
        user,
        account,
        profile,
        user.email,
        credentials
      ); */
      let res;

      if (account && account.provider !== "credentials") {
        console.log(
          "************FROM CALLBACKS GITHUB & GOOGLE SIGN IN************"
        );
        res = await axios.post(`${baseUrl}/auth/oauth`, {
          provider: account.provider,
          email: user.email,
          name: user.name,
          avatar: user.image,
        });
      }
      console.log("************FROM CALLBACKS SIGN IN************", res?.data);
      if (res?.status === 200) {
        user.id = res?.data.id;
        user.role = res?.data.role;
        user.accessToken = res?.data.accessToken;
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
      }
      console.log("SESSION FROM LIB/AUTH===>", session);

      return session;
    },
    /*     async redirect({ url, baseUrl }) {
      const redirectUrl = url.startsWith("/")
        ? new URL(url, baseUrl).toString()
        : url;
      console.log(
        `Redirecting to "${redirectUrl}" (resolved from url "${url}" and baseUrl "${baseUrl}")`
      );
      return redirectUrl;
    }, */
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
