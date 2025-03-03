import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"; // Added GitHub provider
import { getUserById } from "~/lib/user";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/lib/prisma";
import type { Profile } from "next-auth";
const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: config.AuthSecret,
  debug: process.env.NODE_ENV !== 'production', // Enable debug in development
  pages: {
    // Custom error page that will handle authentication errors
    error: '/?auth_error=true'
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: config.GoogleClientId,
      clientSecret: config.GoogleClientSecret,
    }),
    // Added GitHub provider configuration
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GitHubProvider.default({
      clientId: config.GitHubClientId,
      clientSecret: config.GitHubClientSecret,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session, user }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        session.user.name = token.name;
        session.user.image = token.picture || undefined;
        session.user.stripeCustomerId = token.stripeCustomerId;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.stripeCustomerId = dbUser.stripeCustomerId;
      return token;
    },
  },
});
