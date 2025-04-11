export interface IUser {
    id: string;
    email?: string;
    name?: string;
    profileImage?: string;
    googleId?: string;
    githubId?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface UserWithTokens {
    user: IUser;
    tokens: AuthTokens;
  }
  
  export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
  }