import express from 'express';
import session from 'express-session'; // Add this line
import cookieSession from 'cookie-session'; // If you want to use cookie-based sessions
import cors from 'cors';
import passport from 'passport';
import { router as authRoutes } from './routes/authRoutes';
import { router as testRoutes } from './routes/userRoutes';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Session setup
const key = process.env.SESSIONKEY || 'default_secret_key'; // Fallback if SESSIONKEY is not set

app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Passport middleware for session handling
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Use authRoutes for /auth routes
app.use("/auth", authRoutes);

// Use testRoutes for other routes
app.use("/", testRoutes);

app.listen(3000, () => {
  console.log('App listening for requests on port 3000');
});
