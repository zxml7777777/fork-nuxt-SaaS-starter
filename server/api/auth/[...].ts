import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"; // Added GitHub provider
import { getUserByEmail, getUserById } from "~/lib/user";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/lib/prisma";
import type { Profile, Account } from "next-auth";
const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: config.AuthSecret,
  debug: process.env.NODE_ENV !== 'production', // Enable debug in development
  // 添加自定义错误页面配置，重定向到首页
  pages: {
    signIn: '/',
    error: '/'
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: config.GoogleClientId,
      clientSecret: config.GoogleClientSecret,
      authorization: {
        params: {
          prompt: "select_account", // 强制显示账号选择界面
          access_type: "offline"    // 获取刷新令牌
        }
      }
    }),
    // Added GitHub provider configuration
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GitHubProvider.default({
      clientId: config.GitHubClientId,
      clientSecret: config.GitHubClientSecret,
      authorization: {
        params: {
          // GitHub没有直接的账号选择参数，但可以尝试清除会话
          login: ""  // 空值会提示用户重新登录
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  // 修复 State cookie was missing 错误
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900, // 15 分钟
      },
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: false, // 允许JavaScript访问
        sameSite: "lax", // 改回lax
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900, // 15 分钟
      },
    },
    nonce: {
      name: `next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // 如果没有邮箱，则拒绝登录
      if (!user.email) {
        return false;
      }

      // 如果没有账户信息，则拒绝登录
      if (!account) {
        return false;
      }

      try {
        // 检查是否已存在具有相同邮箱的用户
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        if (existingUser) {
          // 检查用户是否已经有当前提供商的账户
          const existingAccount = existingUser.accounts.find(
            (acc) => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId
          );

          if (!existingAccount) {
            // 创建账户数据对象，处理可能的 null 或 undefined 值
            const accountData = {
              userId: existingUser.id,
              type: account.type || "oauth",
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token || null,
              access_token: account.access_token || null,
              expires_at: account.expires_at || null,
              token_type: account.token_type || null,
              scope: account.scope || null,
              id_token: account.id_token || null,
              session_state: account.session_state || null,
            };
            
            // 创建新的账户关联
            await prisma.account.create({
              data: accountData,
            });
          } else {
            // 如果账户已存在，更新账户信息
            await prisma.account.update({
              where: { id: existingAccount.id },
              data: {
                access_token: account.access_token || existingAccount.access_token,
                refresh_token: account.refresh_token || existingAccount.refresh_token,
                expires_at: account.expires_at || existingAccount.expires_at,
                token_type: account.token_type || existingAccount.token_type,
                scope: account.scope || existingAccount.scope,
                id_token: account.id_token || existingAccount.id_token,
                session_state: account.session_state || existingAccount.session_state,
              },
            });
          }

          // 更新用户信息（如果需要）
          const updateData: any = {};
          let needsUpdate = false;

          if (!existingUser.name && user.name) {
            updateData.name = user.name;
            needsUpdate = true;
          }

          // 处理用户头像
          if (!existingUser.image && user.image) {
            updateData.image = user.image;
            needsUpdate = true;
          }

          // 如果是 Google 登录，优先使用 Google 的头像
          if (account.provider === "google" && user.image && existingUser.image !== user.image) {
            updateData.image = user.image;
            needsUpdate = true;
          }
          
          // 如果是 GitHub 登录，总是使用 GitHub 头像
          if (account.provider === "github" && user.image) {
            updateData.image = user.image;
            needsUpdate = true;
          }

          if (needsUpdate) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: updateData,
            });
          }

          // 使用现有用户的 ID
          user.id = existingUser.id;
        } else {
          // 新用户将由 PrismaAdapter 自动创建
        }

        return true;
      } catch (error) {
        return false;
      }
    },
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
  // 由于类型问题，移除错误回调，改用pages配置处理错误
});
