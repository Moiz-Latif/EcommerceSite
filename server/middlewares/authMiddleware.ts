import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.AdminToken; // Get token from cookies

  if (!token) {
    console.log("No admin token found. Unauthorized.");
    res.status(401).json({ message: "Unauthorized - Please log in as Admin" });
    return;
  }

  try {
    const secretKey = "Thisisthejwtsecretfornow"; // Move to .env in production
    const decoded = jwt.verify(token, secretKey);
    
    console.log("Admin Token Verified:", decoded);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Forbidden - Invalid token" });
    return;
  }
};
