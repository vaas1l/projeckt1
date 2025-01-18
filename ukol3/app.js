import express from 'express'

const port = 3000

const app = express()

app.set('view engine', 'ejs')

let id = 1

const todos = [
  {
    id: id++,
    text: 'Vzít si dovolenou',
    done: false,
  },
  {
    id: id++,
    text: 'Koupit Elden Ring',
    done: false,
  },
]

app.get('/', (req, res) => {
  res.render('index', {
		title: 'ToDos!',
		todos,
	})
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})