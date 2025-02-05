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

const fakeUser = {
  username: 'admin@gmail.com',
  password: '123', // Фіксовані значення для тестування
};

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});


app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Перевіряємо, чи всі поля заповнені
  if (!username || !email || !password) {
    return res.render('register', { error: 'Всі поля обов’язкові.' });
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.render('register', { error: 'Користувач із таким email вже існує.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({
      username,
      email,
      password: hashedPassword,
    });

    console.log(`Користувача ${username} успішно зареєстровано.`);
    res.redirect('/login');
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    res.status(500).render('register', { error: 'Сталася внутрішня помилка.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.render('login', { error: 'Неправильний email або пароль.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Неправильний email або пароль.' });
    }

    req.session.user = user.email;
    res.redirect('/');
  } catch (error) {
    console.error('Помилка входу:', error);
    res.status(500).render('login', { error: 'Сталася внутрішня помилка.' });
  }
});


app.get('/',ensureAuthenticated, async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    let filteredTodos;
    let totalCount = 0;  
    const result = await db('todos').count('id as total').first();
    totalCount = result.total;

    if (filter === 'all') {
      filteredTodos = await db('todos').select('*');
    } else if (filter === 'done') {
      filteredTodos = await db('todos').where({'done': true});
    } else if (filter === 'not_done') {
      filteredTodos = await db('todos').where({'done': false});
    } else if (filter === 'priority') {
      filteredTodos = await db('todos').select('*').orderBy('priority', 'asc');
    } else {
      console.warn(`Unknown filter value: ${filter}. Defaulting to 'all'.`);
      filteredTodos = await db('todos').select('*'); 
    }

    res.render('index', {
      title: 'ToDos!',
      todos: filteredTodos.map(todo => ({
        ...todo,
        due_date: todo.due_date ? dayjs(todo.due_date).format('YYYY-MM-DD') : null,
        created_at: todo.created_at ? dayjs(todo.created_at).format('YYYY-MM-DD HH:mm:ss') : null
      })),
      totalCount,
      filter,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/toggle',ensureAuthenticated, async (req, res) => {
   try {
    const { id, filter } = req.body;

    if (!id) {
      return res.status(400).send('ID is required.');
    }

    const todo = await db('todos').where('id', id).first();
    const newDoneStatus = !todo.done;
    await db('todos').where('id', id).update({ done: newDoneStatus });
    console.log(`Todo updated: ID = ${id}, New done status = ${newDoneStatus}`);
    res.redirect(`/?filter=${filter}`); 
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit',ensureAuthenticated, async (req, res) => {
  try {
    const { id, text, priority, filter } = req.body;
 
    if (!id) {
      return res.status(400).send('ID is required.');
    }

    if (!text) {
      return res.status(400).send('Text is required.');
    }
    const todo = await db('todos').where('id', id).first();
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }

    const validPriorities = ['1', '2', '3']; // 1 = High, 2 = Average, 3 = Low
    if (!validPriorities.includes(priority)) {
      return res.status(400).send('Invalid priority value.');
    }
    await db('todos')
      .where('id', id)
      .update({
        text: text.trim(),
        priority: parseInt(priority, 10),
      });

    console.log(`id=${id} updated: text="${text.trim()}", priority=${priority}`);
    res.redirect(`/?filter=${filter}`);
  } catch (error) {
    console.error('Error editing todo:', error);
    res.status(500).send('Internal Server Errorrrr');
  }
});

app.get('/delete',ensureAuthenticated, async (req, res) => {
  const todoId = parseInt(req.query.id);

  try {
    const todo = await db('todos').where('id', todoId).first();

    await db('todos').where('id', todoId).del();
    console.log(`Deleted: ID = ${todoId}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/add',ensureAuthenticated, async (req, res) => {
  const newTaskText = req.query.text;
  const dueDate = req.query.due_date;

  try {
    const ids = await db('todos').pluck('id');
    const allIds = new Set(ids);
    let newId = 1;
    let newPriority = 1;
    while (allIds.has(newId)) {
      newId++;
    }

    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    await db('todos').insert({ id: newId, text: newTaskText.trim(), done: false, priority: newPriority, created_at: createdAt, due_date: dueDate ? dayjs(dueDate).format('YYYY-MM-DD HH:mm:ss') : null  });
    console.log(`Task added: ID = ${newId}, Text = "${newTaskText.trim()}", Priority = "${newPriority}", CreatedAt = "${createdAt}", DueDate = "${dueDate}"`);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/update-due-date',ensureAuthenticated, async (req, res) => {

  try {
    const { id, due_date, filter } = req.body;
    if (!id) {
      return res.status(400).send('ID is required.');
    }
    if (!due_date) {
      return res.status(400).send('Due date is required.');
    }
  

    const formattedDueDate = dayjs(due_date).format('YYYY-MM-DD HH:mm:ss');

    await db('todos')
      .where({ id })
      .update({ due_date: formattedDueDate });

    console.log(`id=${id} updated due_date to ${formattedDueDate}`);
    res.redirect(`/?filter=${filter || 'all'}`);
  } catch (error) {
    console.error('Error updating due date:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})