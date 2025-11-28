import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find or create user
                const [user] = await User.findOrCreate({
                    where: { googleId: profile.id },
                    defaults: {
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        avatarUrl: profile.photos[0].value,
                        provider: 'google',
                        rawProfile: profile
                    }
                });
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [user] = await User.findOrCreate({
                    where: { linkedinId: profile.id },
                    defaults: {
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        avatarUrl: profile.photos[0].value,
                        provider: 'linkedin',
                        rawProfile: profile
                    }
                });
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));
}

// Twitter Strategy
if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_SECRET,
        callbackURL: "/auth/twitter/callback"
    },
        async (token, tokenSecret, profile, done) => {
            try {
                const [user] = await User.findOrCreate({
                    where: { twitterId: profile.id },
                    defaults: {
                        displayName: profile.displayName,
                        avatarUrl: profile.photos[0].value,
                        provider: 'twitter',
                        rawProfile: profile
                    }
                });
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));
}

export default passport;
