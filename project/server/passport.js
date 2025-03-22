
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import knex from 'knex';
import knexfile from './knexfile.js';

const db = knex(knexfile);

const passportConfig = (passport) => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                username = username.toLowerCase();

                const user = await db('users').where({ email: username }).first();

                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' })
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                return done(null, {
                    id: user.id,
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
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log('Passport deserializeUser');
        const user = await db('users').where({ id }).first();

        if (!user) {
            return done(null, false);
        }
        done(null, user);
    });
}

export default passportConfig;