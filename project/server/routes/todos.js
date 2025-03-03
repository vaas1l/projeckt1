import express from 'express'
import knex from 'knex'
import knexfile from '../knexfile.js'


const db = knex(knexfile)
const router = express.Router()

router.get('/todos', async (req, res) => {
    const user_id = req.body;
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
    const {user_id} = req.body;

    if (!text) {
        return res.status(400).json({ success: false, message: 'Text is required' });
    }

    try {
        const maxIdResult = await db('todos').max('id as maxId').first();
        const newId = maxIdResult?.maxId ? maxIdResult.maxId + 1 : 1;
        const user_id = req.user;

        const [newTodo] = await db('todos')
            .insert({ id: newId, text, done: 0, priority: 2, created_at: new Date().toISOString(), user_id })
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

    console.log(`Received request: id=${id}, new done=${done}`); 

    if (typeof done !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid done value' });
    }

    try {
        const updatedCount = await db('todos').where({ id }).update({ done });

        if (updatedCount) {
            const updatedTodo = await db('todos').where({ id }).first();
            return res.json({ success: true, message: 'Task status updated', todo: updatedTodo });
        } else {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/todos/update-priority/:id', async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    console.log(`Received request to update priority: id=${id}, priority=${priority}`);

    if (!id || priority === undefined) {
        return res.status(400).json({ success: false, message: 'Both "id" and "priority" are required' });
    }

    try {
        const updatedCount = await db('todos')
            .where({ id })
            .update({ priority });

        if (updatedCount) {
            return res.json({ success: true, message: 'Task priority updated' });
        } else {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/todos/update-due-date/:id', async (req, res) => {
    const { id } = req.params;
    const { due_date } = req.body;

    if (!id || !due_date) {
        return res.status(400).json({ success: false, message: 'Both "id" and "due_date" are required' });
    }

    try {
        const updatedCount = await db('todos')
            .where({ id })
            .update({ due_date });

        if (updatedCount) {
            const updatedTodo = await db('todos').where({ id }).first();
            return res.json({ success: true, message: 'Due date updated', todo: updatedTodo });
        } else {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
export default router;