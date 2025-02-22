import express from 'express'
import knex from 'knex'
import knexfile from '../knexfile.js'

const db = knex(knexfile)
const router = express.Router()

router.get('/todos', async (req, res) => {
    try {
        const todos = await db('todos').select('*');
        return res.json(todos);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await db('todos').where({ id }).del();

        if (deletedCount) {
            return res.json({ success: true, message: 'Todo deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/todos', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ success: false, message: 'Text is required' });
    }

    try {
        const maxIdResult = await db('todos').max('id as maxId').first();
        const newId = maxIdResult?.maxId ? maxIdResult.maxId + 1 : 1;

        const [newTodo] = await db('todos')
            .insert({ id: newId, text, done: false })
            .returning('*');

        res.status(201).json({ success: true, todo: newTodo });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
router.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;

    if (typeof done !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid done value' });
    }

    try {
        const updatedCount = await db('todos')
            .where({ id })
            .update({ done });

        if (updatedCount) {
            return res.json({ success: true, message: 'Task status updated' });
        } else {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
    console.log(`Task ${id} updated to ${!done}`);
});
export default router;