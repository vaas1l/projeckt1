import express from 'express';
import knex from 'knex';
import knexfile from '../knexfile.js';
import bcrypt from 'bcrypt';

const db = knex(knexfile);
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [newUser] = await db('users')
            .insert({ username, email, password: hashedPassword })
            .returning(['id', 'email']);

        console.log(`User ${email} registered successfully.`);
        res.status(201).json({ success: true, user_id: newUser.id, message: 'Registration successful. Please log in.' });
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

    try {
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        console.log(`User ${email} logged in successfully.`);
        res.json({ success: true, user_id: user.id, message: 'Login successful.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get user information
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db('users').where({ id }).first();
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;