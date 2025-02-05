import express from 'express'
import knex from 'knex'
import knexfile from './knexfile.js'
import dayjs from 'dayjs'
import session from 'express-session';
import bcrypt from 'bcrypt';

const port = 3000

const app = express()
const db = knex(knexfile)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data
app.use(express.static('public'));
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true,
}));

let id = 1

const todos = []

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.post('/add-user', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).send('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({
      email,
      password: hashedPassword,
    });

    console.log(`User ${email} has been successfully added. ${password}`);
    res.send('User has been successfully added.');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Failed to add user.');
  }
});

app.get('/', ensureAuthenticated, async (req, res) => {
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

app.get('/add', ensureAuthenticated, async (req, res) => {
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

app.post('/toggle', ensureAuthenticated, async (req, res) => {
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

app.post('/edit', ensureAuthenticated, async (req, res) => {
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

app.get('/delete', ensureAuthenticated, async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});