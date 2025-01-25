import express from 'express'
import knex from 'knex'
import knexfile from './knexfile.js'

const port = 3000

const app = express()
const db = knex(knexfile)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

app.use(express.static('public'));

let id = 1

const todos = []

app.get('/', async (req, res) => {
  const filter = req.query.filter || 'all';
  let filteredTodos = [];
  if (filter === 'all') {
    const todos = await db('todos').select('*') // * znamena vsechny sloupce
    filteredTodos = todos;
  } else if (filter === 'done') {
    filteredTodos = todos.filter(t => t.done);
  } else if (filter === 'not_done') {
    filteredTodos = todos.filter(t => !t.done);
  }

  res.render('index', {
    title: 'ToDos!',
    todos: filteredTodos,
    filter,
  });
})

app.post('/toggle', (req, res) => {
  console.log(req.body);
  const todo = todos.find(t => t.id == req.body.id);
  if (todo) todo.done = !todo.done;
  res.redirect('/');
});

app.post('/edit', async (req, res) => {
  const { id, text } = req.body;
  const todo = await db('todos').select('*').where('id', id).first()
  if(!todo) {
    return res.status(404).send('Not found')
  }
  if (todo && text.trim() !== '') {
    const originalText = todo.text;
    todo.text = text.trim();
    console.log(`id=${id} edit: ${originalText} -> ${todo.text}`);
  }

  res.redirect('/');
});

app.get('/delete', (req, res) => {
  const todoId = parseInt(req.query.id);
  console.log(`id=${todoId} delete`);
  const index = todos.findIndex(t => t.id === todoId);
  if (index !== -1) {
    todos.splice(index, 1);
  }
  res.redirect('/');
});

app.get('/add', async (req, res) => {
  const newTaskText = req.query.text;
  if (newTaskText && newTaskText.trim() !== '') {
    await db('todos').insert({ text: newTaskText.trim() })
  }
  
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})