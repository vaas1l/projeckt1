import express from 'express';
import knex from 'knex';
import knexfile from '../knexfile.js';

const db = knex(knexfile);
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.post('/delete-user', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).send('User not found.');
    }

    await db('todos').where({ user_id: userId }).del();
    console.log(`All tasks for user ID=${userId} have been deleted.`);

    await db('users').where({ id: userId }).del();
    console.log(`User with ID=${userId} has been deleted.`);
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session deletion error:', err);
        return res.status(500).send('Failed to delete the user.');
      }
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;