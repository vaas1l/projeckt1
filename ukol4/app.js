import express from 'express'
import knex from 'knex'
import knexfile from './knexfile.js'

const port = 3000

const app = express()
const db = knex(knexfile)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

app.use(express.static('public'));

let id = 1

const todos = []




app.get('/', async (req, res) => {
  const filter = req.query.filter || 'all';
  let filteredTodos;

  try {
    if (filter === 'all') {
      filteredTodos = await db('todos').select('*');
    } else if (filter === 'done') {
      filteredTodos = await db('todos').where({'done': true});
    } else if (filter === 'not_done') {
      filteredTodos = await db('todos').where({'done': false});
    } else if (filter === 'priority') {
      filteredTodos = await db('todos').select('*').orderBy('priority', 'asc');
    } else {
      return res.status(400).send('Invalid filter value');
    }

    res.render('index', {
      title: 'ToDos!',
      todos: filteredTodos,
      filter,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/toggle', async (req, res) => {
  const { id } = req.body;
   try {
    const todo = await db('todos').where('id', id).first();
    const newDoneStatus = !todo.done;
    await db('todos').where('id', id).update({ done: newDoneStatus });
    console.log(`Todo updated: ID = ${id}, New done status = ${newDoneStatus}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit', async (req, res) => {
  const { id, text, priority } = req.body;

  try {
    const todo = await db('todos').where('id', id).first();
    if (!todo) {
      return res.status(404).send('Todo not found.');
    }

    const validPriorities = ['1', '2', '3']; // 1 = High, 2 = Average, 3 = Low
    if (!validPriorities.includes(priority)) {
      return res.status(400).send('Invalid priority value.');
    }
    await db('todos')
      .where('id', id)
      .update({
        text: text.trim(),
        priority: parseInt(priority, 10),
      });

    console.log(`id=${id} updated: text="${text.trim()}", priority=${priority}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error editing todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/delete', async (req, res) => {
  const todoId = parseInt(req.query.id);

  try {
    const todo = await db('todos').where('id', todoId).first();

    await db('todos').where('id', todoId).del();
    console.log(`Deleted: ID = ${todoId}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/add', async (req, res) => {
  const newTaskText = req.query.text;
  try {
    const ids = await db('todos').pluck('id');
    const allIds = new Set(ids);
    let newId = 1;
    let newPriority = 1;
    while (allIds.has(newId)) {
      newId++;
    }
    await db('todos').insert({ id: newId, text: newTaskText.trim(), done: false, priority: newPriority });
    console.log(`Task added: ID = ${newId}, Text = "${newTaskText.trim()}", Priority = "${newPriority}"`);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})