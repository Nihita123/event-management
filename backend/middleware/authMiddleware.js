import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

export const isManager = (req, res, next) => {
  if (req.user?.role !== "manager") {
    return res.status(403).json({ message: "Access denied. Manager only." });
  }
  next();
};

export const isMarketing = (req, res, next) => {
  if (req.user?.role === "marketing") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Marketing only" });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};
