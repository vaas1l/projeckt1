import express from 'express';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';

const SQLiteStoreSession = SQLiteStore(session);
const app = express();

app.use(express.json());
app.use(
    session({
        store: new SQLiteStoreSession({ db: 'sessions.sqlite', dir: './database' }), // Збереження сесій у файлі
        secret: 'your_secret_key', // Замінити на щось надійне
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, // 1 година
    })
);

import authRoutes from './routes/authRoutes.js';
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Сервер запущено на порту 3000'));