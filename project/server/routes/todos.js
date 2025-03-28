import express from 'express'
import mongoose from 'mongoose';
import Todo from '../model/Todo.js'



const router = express.Router()

router.get('/todos', async (req, res) => {
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    try {
        const todos = await Todo.find({ userId: user_id });
        return res.json({ success: true, todos });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        console.log('Todo deleted:', deletedTodo);

        if (!deletedTodo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        return res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/todos', async (req, res) => {
    const { text } = req.body; 

    const user_id = req.user.id;
    console.log('User ID:', req.user);
    if (!text) {
        return res.status(400).json({ success: false, message: 'Text is required' });
    }

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const newTodo = new Todo({
            text,
            done: false,
            priority: 2,
            dueDate: new Date(),
            userId: user_id,

        });
        await newTodo.save();
        console.log('New task added:', newTodo);
        res.status(201).json({ success: true, todo: newTodo });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;

    console.log('Received update for ID:', id, 'done:', done);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid MongoDB ID format' });
    }

    if (typeof done !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid done value' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { done }, { new: true });
        console.log('Updated task:', updatedTodo);

        if (updatedTodo) {
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

    if (!id || priority === undefined) {
        return res.status(400).json({ success: false, message: 'Both "id" and "priority" are required' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { priority }, { new: true });
        console.log('Updated task:', updatedTodo);  

        if (updatedTodo) {
            return res.json({ success: true, message: 'Task priority updated', todo: updatedTodo });
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
        const updatedTodo = await Todo.findByIdAndUpdate(id, { dueDate: due_date }, { new: true });

        if (updatedTodo) {
            return res.json({ success: true, message: 'Due date updated', todo: updatedTodo });
        } else {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


export default router;