import { PrismaClient, User } from "@packages/prisma";
import { Request, Response } from "express";
import {
  generateTokens,
  revokeAllUserTokens,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../configs/jwt";

const prisma = new PrismaClient();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "lax" as "lax",
};

export const handleOauthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const tokens = await generateTokens(user);

    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${tokens.accessToken}`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error`);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await verifyRefreshToken(refreshToken);

    await revokeRefreshToken(refreshToken);

    const tokens = await generateTokens(user);

    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // The user is attached by the auth middleware
  const userId = (req as any).userId;

  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
