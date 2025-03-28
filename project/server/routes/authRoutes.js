import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../model/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }
        

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        console.log(`User ${email} registered successfully.`);
        res.status(201).json({ success: true, user_id: newUser._id, message: 'Registration successful. Please log in.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    req.body.username = email;

    passport.authenticate('local', (err, user, options) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to login' });
        }

        if (!user) {
            return res.status(401).json({ error: options?.message || 'User not found' });
        }

        req.login(user, (error) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to login' });
            }

            console.log('User logged in successfully.');
            return res.json(req.user);
        });
    })(req, res);
});

router.post('/logout', (req, res) => {
    if (!req.user) {
        return res.status(200).json({
            success: true,
            msg: "User is not logged in",
        });
    }

    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                error: 'Failed to log out',
            });
        }

        req.session.destroy(() => {
            return res.status(200).json({ success: true, msg: 'Logged out' });
        });
    });
});

// Check if user is logged in
router.get('/is-authenticated', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ success: true, user: req.user });
    }

    res.status(200).json({ error: 'User not logged in' });
});

router.get('/current-user', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        const user = await User.findById(req.user.id).select('id username email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Failed to get user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (deletedUser) {
            console.log(`User ${id} deleted successfully.`);
            return res.json({ success: true, message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;