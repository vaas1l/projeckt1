import express from 'express'
import knex from 'knex'
import knexfile from '../knexfile.js'
import dayjs from 'dayjs'

const db = knex(knexfile)
const router = express.Router()

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/login');
}


router.post('/update-due-date', ensureAuthenticated, async (req, res) => {
  try {
    const { id, due_date, filter } = req.body;
    const userId = req.session.user.id;

    if (!id || !due_date) {
      return res.status(400).send('ID and due_date are required.');
    }

    const formattedDueDate = dayjs(due_date).format('YYYY-MM-DD HH:mm:ss');

    const todo = await db('todos').where({ id, user_id: userId }).first();
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }

    await db('todos').where({ id, user_id: userId }).update({ due_date: formattedDueDate });
    console.log(`id=${id} updated due_date to ${formattedDueDate}`);
    res.redirect(`/?filter=${filter}`);
  } catch (error) {
    console.error('Error updating due date:', error);
    res.status(500).send('Internal Server Error');
  }
});


export default router