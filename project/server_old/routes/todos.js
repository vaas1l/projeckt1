import express from 'express'
import knex from 'knex'
import knexfile from '../knexfile.js'
const db = knex(knexfile)
const router = express.Router()

router.get('/todos', async (req, res) => {
    const todos = await db('todos').select('*');
    return res.json(todos);
});

export default router