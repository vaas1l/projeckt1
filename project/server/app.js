import express from 'express'
import todos from './routes/todos.js'
import auth from './routes/authRoutes.js'
import cors from 'cors'
import passport from 'passport'
import expressSession from 'express-session'
import connectMongoDBSession from 'connect-mongodb-session'
const MongoDBStore = connectMongoDBSession(expressSession);
import passportConfig from './passport.js'
import Database from './db/index.js'
import path from 'path';
const __dirname = path.resolve();

const port = 3000
Database.getInstance()
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

passportConfig(passport)

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/todos',
  collection: 'sessions',
  connectionOptions: {
    serverSelectionTimeoutMS: 10000,
  },
})

store.on('error', function (error) {
  console.log(error)
})

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

// Serve static files
app.get('*', async (req, res) => {
  return res.sendFile(
    path.resolve(__dirname, 'public', 'index.html'),
  )
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});