import express from 'express'

const port = 3000

const app = express()

app.set('view engine', 'ejs')

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

app.post('/toggle/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (todo) todo.done = !todo.done;
  res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})