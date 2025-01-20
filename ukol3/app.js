import express from 'express'

const port = 3000

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

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
    id: 5,
    text: 'Neco udelat',
    done: false,
  }
]

app.get('/', (req, res) => {
  res.render('index', {
		title: 'ToDos!',
		todos,
	})
})

app.post('/toggle', (req, res) => {
  console.log(req.body);
  const todo = todos.find(t => t.id == req.body.id);
  if (todo) todo.done = !todo.done;
  res.redirect('/');
});

app.get('/delete', (req, res) => {
  const todoId = parseInt(req.query.id); 
  const index = todos.findIndex(t => t.id === todoId); 
  if (index !== -1) {
    todos.splice(index, 1); 
  }
  res.redirect('/'); 
});

app.get('/add', (req, res) => {
  const newTaskText = req.query.text;
  if (newTaskText && newTaskText.trim() !== '') {
    todos.push({
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      text: newTaskText,
      done: false,
    });
  }
  res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})