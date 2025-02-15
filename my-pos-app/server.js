const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', function(req, res) {
  res.send('');
});

// Отримати всі послуги
app.get('/services', async (req, res) => {
  try {
    const services = await knex('services').select('*');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Додати замовлення
app.post('/orders', async (req, res) => {
  try {
    const { service_id, quantity } = req.body;

    const service = await knex('services').where({ id: service_id }).first();
    if (!service) return res.status(404).json({ error: 'Послуга не знайдена' });

    const total_price = service.price * quantity;
    const newOrder = await knex('orders').insert({ service_id, quantity, total_price });

    res.json({ message: 'Замовлення додано', order_id: newOrder[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отримати всі замовлення
app.get('/orders', async (req, res) => {
  try {
    const orders = await knex('orders')
      .join('services', 'orders.service_id', '=', 'services.id')
      .select('orders.id', 'services.name', 'orders.quantity', 'orders.total_price', 'orders.created_at');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));