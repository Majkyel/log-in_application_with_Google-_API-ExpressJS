const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
const app = express();
let googleProfile = {};

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
    },
                                
    function(accesToken, refreshToken, profile, cb) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        };
        cb(null, profile);
    }
));

app.get('/', function(req, res) {
    console.log('I am rendering main page...');
    res.render('main_page_template', {user: req.user});
});

app.get('/log_in', function(req, res) {
    console.log('Correct data! I am rendering correct log in page...');
    res.render('user_log_in', {user: googleProfile}); 
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('https://mail.google.com/mail/u/0/?logout&hl=en');
});

app.get('/auth/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/log_in',
        failureRedirect: '/'
    })
);

app.listen(3000);

app.use(function(req, res, next) {
    res.status(404).render('error_data');
});
