import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PrismaClient, User } from "@prisma/client";
import { Profile as GitHubProfile } from "passport-github2";
import { VerifyCallback } from "passport-google-oauth20";

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google Client ID and Secret must be provided");
}
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("GitHub Client ID and Secret must be provided");
}

// ------- Google Strategy --------
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId: profile.id },
                    { email: profile.emails?.[0]?.value }
                ]
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                    profileImage: profile.photos?.[0]?.value,
                }
            })
        } else if (!user.googleId){
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId: profile.id,
                    name: user.name || profile.displayName,
                    profileImage: user.profileImage || profile.photos?.[0]?.value,
                }
            })
        }

        return done (null, user);
    } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error as Error);
    }
  }
));

// ------- GitHub Strategy --------
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/api/auth/github/callback`,
    scope: ["user:email"]
  },
 async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: VerifyCallback) => {
    try{
        const email = profile.emails?.[0]?.value;

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { githubId: profile.id},
                    { email }
                ]
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    githubId: profile.id,
                    email,
                    name: profile.displayName || profile.username,
                    profileImage: profile.photos?.[0]?.value,
                }
            })
        } else if (!user.githubId){
            user = await prisma.user.update({
                where: { id: user.id},
                data: {
                    githubId: profile.id,
                    email,
                    name: profile.displayName || profile.username,
                    profileImage: user.profileImage || profile.photos?.[0]?.value,
                }
            })
        }

        return done(null, user);
    } catch(error) {
        return done(error as Error);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, (user as User).id);
})

passport.deserializeUser(async (id: string | undefined, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        done(null, user);
    } catch (error) {
        done(error);
    }
})


export default passport;