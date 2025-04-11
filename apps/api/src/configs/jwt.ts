import { AuthTokens, JwtPayload } from "@/interfaces/user.interface";
import { PrismaClient, User } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as Secret;
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "15m";
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "7d";

export const generateTokens = async (user: User): Promise<AuthTokens> => {
  const jwtPayload: jwt.JwtPayload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRATION as any,
  });

  const refreshToken = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRATION as any,
  });

  const decoded = jwt.decode(refreshToken) as JwtPayload;
  const expiresAt = new Date(decoded.exp * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const verifyRefreshToken = async (token: string): Promise<User> => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const savedToken = await prisma.refreshToken.findUnique({
            where : {token},
            include: {user: true}
        });

        if (!savedToken) {
            throw new Error("Token not found");
        }

        return savedToken.user;
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
}

export const revokeRefreshToken = async (token: string): Promise<void> => {
    await prisma.refreshToken.delete({
        where: { token}
    });
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({
        where: { userId }
    });
}
