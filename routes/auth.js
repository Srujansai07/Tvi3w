import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

// LinkedIn Auth
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Twitter Auth
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Current User
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

export default router;
