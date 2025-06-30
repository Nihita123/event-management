import express from "express";
import passport from "passport";
import { login, register } from "../controllers/authController.js";
import { generateToken } from "../utils/generateToken.js";
// in authRoutes.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ----- existing local auth ----- */
router.post("/register", register);
router.post("/login", login);

/* ----- Google OAuth ----- */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw Error();
    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: false, // we’ll send a JWT instead of relying on cookies
  }),
  (req, res) => {
    // issue the same JWT the local flow produces
    const token = generateToken(req.user._id);
    // you have two common choices:
    // 1. JSON response for an SPA popup flow
    //    res.json({ token, user: req.user });
    // 2. Redirect with token in URL/hash
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

export default router;
