const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');


function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, {
                message: 'Username is not found'
            });
        }
        try {
            const validPass = await bcrypt.compare(password, user.password);
            if (!validPass) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            return done(null, user);
        });
    });
}

module.exports = initialize;