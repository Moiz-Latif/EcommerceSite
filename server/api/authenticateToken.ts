import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken; // Or token from headers, query params, etc.

  if (!token) {
    // If no token, redirect to the default route (e.g., login or homepage)
    return res.redirect('/'); // Default route
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, "SECRET_KEY");

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired, redirect to default route
    return res.redirect('/');
  }
};

export default authenticateToken;
