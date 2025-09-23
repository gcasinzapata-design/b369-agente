import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isEmailAllowed } from "@/lib/allowlist";
export const { handlers, auth } = NextAuth({
  providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })],
  callbacks: { async signIn({ profile }) { return isEmailAllowed(profile?.email ?? null); } },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET
});
