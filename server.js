const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Food data organized by classification
const foodItems = {
  'Beverages': [
    { id: 1, name: 'Coffee', price: 3.50, classification: 'Beverages' },
    { id: 2, name: 'Fresh Orange Juice', price: 4.00, classification: 'Beverages' },
    { id: 3, name: 'Iced Tea', price: 2.50, classification: 'Beverages' }
  ],
  'Appetizers': [
    { id: 4, name: 'Spring Rolls', price: 5.99, classification: 'Appetizers' },
    { id: 5, name: 'Bruschetta', price: 6.50, classification: 'Appetizers' },
    { id: 6, name: 'Chicken Wings', price: 7.99, classification: 'Appetizers' }
  ],
  'Main Courses': [
    { id: 7, name: 'Grilled Salmon', price: 18.99, classification: 'Main Courses' },
    { id: 8, name: 'Pasta Carbonara', price: 14.99, classification: 'Main Courses' },
    { id: 9, name: 'Beef Steak', price: 22.99, classification: 'Main Courses' }
  ],
  'Desserts': [
    { id: 10, name: 'Chocolate Cake', price: 5.99, classification: 'Desserts' },
    { id: 11, name: 'Vanilla Ice Cream', price: 4.50, classification: 'Desserts' },
    { id: 12, name: 'Cheesecake', price: 6.99, classification: 'Desserts' }
  ]
};

// GET all food items
app.get('/api/foods', (req, res) => {
  res.json(foodItems);
});

// GET foods by classification
app.get('/api/foods/:classification', (req, res) => {
  const { classification } = req.params;
  if (foodItems[classification]) {
    res.json(foodItems[classification]);
  } else {
    res.status(404).json({ error: 'Classification not found' });
  }
});

// GET specific food item by ID
app.get('/api/food/:id', (req, res) => {
  const { id } = req.params;
  for (const category in foodItems) {
    const food = foodItems[category].find(item => item.id === parseInt(id));
    if (food) {
      return res.json(food);
    }
  }
  res.status(404).json({ error: 'Food item not found' });
});

// POST order (placeholder for order handling)
app.post('/api/orders', (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order items required' });
  }
  res.json({ message: 'Order received', orderId: Math.floor(Math.random() * 10000), items });
});

app.listen(PORT, () => {
  console.log(`Food ordering backend running on http://localhost:${PORT}`);
});
