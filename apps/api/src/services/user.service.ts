import { PrismaClient, User } from "@packages/prisma";

const prisma = new PrismaClient();

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByGoogleId = async (
  googleId: string
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: { googleId },
  });
};

export const findUserByGithubId = async (
  githubId: string
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: { githubId },
  });
};

export const createOrUpdateUser = async (
  userData: Partial<User>
): Promise<User> => {
  let user: User | null = null;

  if (userData.googleId) {
    user = await findUserByGoogleId(userData.googleId);
  } else if (userData.githubId) {
    user = await findUserByGithubId(userData.githubId);
  } else if (userData.email) {
    user = await findUserByEmail(userData.email);
  }

  if (user) {
    return prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        updatedAt: new Date(),
      },
    });
  }

  return prisma.user.create({
    data: {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
