import express from 'express'
import knex from 'knex'
import knexfile from '../knexfile.js'
import dayjs from 'dayjs'

import bcrypt from 'bcrypt';

const db = knex(knexfile)
const router = express.Router()

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/login');
}

router.post('/add-user', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).send('A user with this email already exists.');
    }

    const allIds = await db('users').pluck('id');
    let newId = 1;
    while (allIds.includes(newId)) {
      newId += 1;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({
      id: newId,
      email,
      password: hashedPassword,
    });

    console.log(`User ${email} has been successfully added. ${password},${newId} `);
    res.send('User has been successfully added.');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Failed to add user.');
  }
});

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    const userId = req.session.user.id;
    let filteredTodos;
    let totalCount = 0;

    const result = await db('todos').where({ user_id: userId }).count('id as total').first(); 
    totalCount = result.total;

    if (filter === 'all') {
      filteredTodos = await db('todos').where('user_id', userId).select('*'); 
    } else if (filter === 'done') {
      filteredTodos = await db('todos').where({ user_id: userId, done: true }); 
    } else if (filter === 'not_done') {
      filteredTodos = await db('todos').where({ user_id: userId, done: false }); 
    } else if (filter === 'priority') {
      filteredTodos = await db('todos').where('user_id', userId).orderBy('priority', 'asc'); 
    } else {
      console.warn(`Unknown filter value: ${filter}. Defaulting to 'all'.`);
      filteredTodos = await db('todos').where('user_id', userId).select('*'); 
    }

    res.render('index', {
      title: 'ToDos!',
      todos: filteredTodos.map(todo => ({
        ...todo,
        due_date: todo.due_date ? dayjs(todo.due_date).format('YYYY-MM-DD') : null,
        created_at: todo.created_at ? dayjs(todo.created_at).format('YYYY-MM-DD HH:mm:ss') : null,
      })),
      totalCount,
      filter,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/add', ensureAuthenticated, async (req, res) => {
  const newTaskText = req.query.text;
  const dueDate = req.query.due_date;

  try {
    const userId = req.session.user.id;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    await db('todos').insert({
      text: newTaskText.trim(),
      done: false,
      priority: 1,
      created_at: createdAt,
      due_date: dueDate ? dayjs(dueDate).format('YYYY-MM-DD HH:mm:ss') : null,
      user_id: userId,
    });

    console.log(`Task added for user_id=${userId}, Text="${newTaskText.trim()}"`);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/toggle', ensureAuthenticated, async (req, res) => {
  try {
    const { id, filter } = req.body;
    const userId = req.session.user.id;

    if (!id) {
      return res.status(400).send('ID is required.');
    }

    const todo = await db('todos').where({ id, user_id: userId }).first();
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }

    const newDoneStatus = !todo.done;
    await db('todos').where({ id, user_id: userId }).update({ done: newDoneStatus }); 
    console.log(`Todo updated: ID = ${id}, New done status = ${newDoneStatus}`);
    res.redirect(`/?filter=${filter}`);
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit', ensureAuthenticated, async (req, res) => {
  try {
    const { id, text, priority, filter } = req.body;
    const userId = req.session.user.id;

    if (!id) {
      return res.status(400).send('ID is required.');
    }

    if (!text) {
      return res.status(400).send('Text is required.');
    }

    const todo = await db('todos').where({ id, user_id: userId }).first();
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }

    await db('todos').where({ id, user_id: userId }).update({
      text: text.trim(),
      priority: parseInt(priority, 10),
    });

    console.log(`id=${id} updated: text="${text.trim()}", priority=${priority}`);
    res.redirect(`/?filter=${filter}`);
  } catch (error) {
    console.error('Error editing todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/delete', ensureAuthenticated, async (req, res) => {
  const todoId = parseInt(req.query.id);
  const userId = req.session.user.id;

  try {
    const todo = await db('todos').where({ id: todoId, user_id: userId }).first(); 
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }

    await db('todos').where({ id: todoId, user_id: userId }).del(); 
    console.log(`Deleted: ID = ${todoId}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out of your account:', err);
        return res.status(500).send('Could not log out of my account.');
      }
      res.redirect('/login');
    });
  });


export default router