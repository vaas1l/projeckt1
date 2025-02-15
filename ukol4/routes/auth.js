import express from 'express'
import knex from 'knex'
import knexfile from '../knexfile.js'
import bcrypt from 'bcrypt';

const db = knex(knexfile)
const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.render('register', { error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({
      email,
      password: hashedPassword,
    });

    console.log(`User ${email} has been successfully registered.`);
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('register', { error: 'There was an internal error.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.render('login', { error: 'Incorrect email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Incorrect email or password.' });
    }
    req.session.user = { id: user.id, email: user.email };
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { error: 'There was an internal error.' });
  }
});


export default router
