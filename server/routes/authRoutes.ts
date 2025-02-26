import { Router } from "express";
import passport from "passport";
import  '../config/passport-setup';

export const router = Router();

router.get('/login', (req, res) => {
    res.send('This is the login page')
})

router.get('/logout', (req, res) => {
    res.send('Loggin Out...')
})

// In your authRoutes.js
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }) // Request profile and email from Google
  );
  
  // Google OAuth callback
  router.get(
    '/google/redirect',
    passport.authenticate('google', {
      failureRedirect: 'http://localhost:5173', // Handle failure cases
    }),
    (req, res) => {
      if (req.user) {
        // Assuming `req.user` contains the authenticated user object
        //@ts-ignore
        const userId = req.user.id; // Extract the user ID
        res.redirect(`http://localhost:5173/dashboard/${userId}`); // Pass userId as query parameter
      } else {
        res.redirect('http://localhost:5173'); // Redirect to home on failure
      }
    }
  );
  
  


