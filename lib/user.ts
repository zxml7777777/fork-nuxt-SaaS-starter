import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        emailVerified: true,
        accounts: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id },
      include: {
        accounts: true,
      }
    });

    return user;
  } catch {
    return null;
  }
};

// 获取用户的所有关联账户
export const getUserAccounts = async (userId: string) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: userId,
      },
    });

    return accounts;
  } catch {
    return [];
  }
};

// 根据提供商和提供商账户ID获取账户
export const getAccountByProvider = async (userId: string, provider: string, providerAccountId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: userId,
        provider: provider,
        providerAccountId: providerAccountId,
      },
    });

    return account;
  } catch {
    return null;
  }
};
