import express from 'express'
import todos from './routes/todos.js'
import auth from './routes/authRoutes.js'
import passport from 'passport'
import expressSession from 'express-session'
import { ConnectSessionKnexStore } from 'connect-session-knex'
import passportConfig from './passport.js'
import knexConstructor from "knex";

const port = 3000

const app = express()

passportConfig(passport)

const store = new ConnectSessionKnexStore({
  knex: knexConstructor({
    client: "sqlite",
    // connection: ":memory:",
    connection: {
      filename: "todo_db.sqlite",
    },
  }),
  cleanupInterval: 0, // disable session cleanup
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data
app.use(express.static('public'));

app.use(
  expressSession({
    secret: 'SomeR@aLLy$3crEt!@#',
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
    resave: true,
    saveUninitialized: true,
  }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', auth);

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
});

app.use('/api', todos);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});