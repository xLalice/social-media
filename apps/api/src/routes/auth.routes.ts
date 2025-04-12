import express from "express";
import passport from "passport";
import {
  handleOauthCallback,
  refreshToken,
  logout,
  getCurrentUser,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/error",
  }),
  handleOauthCallback
);

// GitHub OAuth routes
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/auth/error",
  }),
  handleOauthCallback
);

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Get current user info
router.get("/me", authenticate, getCurrentUser);

export default router;
