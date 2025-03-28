import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import User from './model/user.js';
import mongoose from 'mongoose';

const passportConfig = (passport) => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                username = username.toLowerCase();

                const user = await User.findOne({ email: username });

                console.log('User:', user);

                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' })
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                return done(null, {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                });
            } catch (error) {
                console.log(error)
                return done(null, false, { message: 'Failed to authorize' });
            }
        })
    );

    passport.serializeUser((user, done) => {
        console.log('Passport serializeUser');
        done(null, user._id.toString());
    });

    passport.deserializeUser(async (id, done) => {
        console.log('Passport deserializeUser');
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return done(null, false);
            }

            const user = await User.findById(id);
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    });
}

export default passportConfig;