import express from 'express'
import todos from './routes/todos.js'
import auth from './routes/authRoutes.js'

const port = 3000

const app = express()


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data
app.use(express.static('public'));

app.use('/api', todos);
app.use('/api/auth', auth);



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});