import express from 'express'
import knex from 'knex'
import knexfile from './knexfile.js'
import session from 'express-session';


import auth from './routes/auth.js'
import funkce from './routes/funkce.js'
import dueDate from './routes/due-date.js'
import deleteUser from './routes/deleteuser.js'
import todos from './routes/todos.js'

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

app.use('/', auth)

app.use('/', funkce)

app.use('/', dueDate)

app.use('/', deleteUser)

app.use('/api', todos) 

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});