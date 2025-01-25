import express from 'express'

const port = 3000

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

app.use(express.static('public'));

let id = 1

const todos = [
  {
    id: 1,
    text: 'Vzít si dovolenou',
    done: false,
  },
  {
    id: 2,
    text: 'Koupit Elden Ring',
    done: false,
  },
  {
    id: 3,
    text: 'Naučit se JavaScript',
    done: false,
  },
  {
    id: 4,
    text: 'Neco udelat',
    done: false,
  }
]

app.get('/', (req, res) => {
  res.render('index', {
		title: 'ToDos!',
		todos,
    filter: 'all',
	})
})

app.post('/toggle', (req, res) => {
  console.log(req.body);
  const todo = todos.find(t => t.id == req.body.id);
  if (todo) todo.done = !todo.done;
  res.redirect('/');
});

app.post('/edit', (req, res) => {
  const { id, text } = req.body;

  const todo = todos.find(t => t.id == id);
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

app.get('/add', (req, res) => {
  const newTaskText = req.query.text;
  if (newTaskText && newTaskText.trim() !== '') {
    const newTask = {
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      text: newTaskText.trim(),
      done: false,
    };
    todos.push(newTask);
    console.log(`new task = "${newTask.text}" id=${newTask.id}`);
  }
  res.redirect('/');
});

app.get('/filter', (req, res) => {
  const filter = req.query.filter || 'all';
  let filteredTodos = todos;

  if (filter === 'done') {
    filteredTodos = todos.filter(t => t.done); 
  } else if (filter === 'not_done') {
    filteredTodos = todos.filter(t => !t.done); 
  }

  res.render('index', {
    title: 'ToDos!',
    todos: filteredTodos,
    filter, 
  });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})