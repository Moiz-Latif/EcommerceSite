import passport from 'passport';
import dotenv from 'dotenv';
import { prisma } from '../routes/userRoutes';

dotenv.config();

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  try {
    // Find the user by ID when deserializing
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    // If user is found, pass it to done
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (error) {
    done(error);
  }
});

passport.use(new GoogleStrategy({
  clientID: clientID!,
  clientSecret: clientSecret!,
  callbackURL: "/auth/google/redirect",
},

  //@ts-ignore
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists in the database by their email
      const existingUser = await prisma.user.findUnique({
        where: {
          identifier: profile.emails[0].value, // Use Google account's email as identifier
        }
      });
      console.log(profile.emails[0].value);

      if (existingUser) {
        // If the user exists, continue with this user
        console.log('User already exists: ', existingUser);
        return done(null, existingUser); // Pass the existing user to Passport
      } else {
        // Generate a unique username if the user doesn't exist
        let username = profile.displayName;


        // Create a new user if they don't exist
        const newUser = await prisma.user.create({
          data: {
            username: username, // Ensure unique username
            password: generateRandomPassword(12), // Generate random password
            identifier: profile.emails[0].value,  // Store user's email as identifier
            authType: 'GOOGLEID', // Set auth type to 'GOOGLE'
            img: profile.photos[0].value
          }
        });
        console.log('New user created: ', newUser);
        return done(null, newUser); // Pass the new user to Passport
      }
    } catch (error) {
      console.log('Error during Google strategy: ', error);
      return done(error); // Handle errors gracefully
    }
  }
));


function generateRandomPassword(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}


