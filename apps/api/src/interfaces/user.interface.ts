import { User } from "@prisma/client";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserWithTokens {
  user: User;
  tokens: AuthTokens;
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}
