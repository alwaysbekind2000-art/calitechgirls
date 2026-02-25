const express = require('express');
const mongoose = require('mongoose');
const foodItemsRoutes = require('./routes/foodItems');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/calitechgirls', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.use('/api/foodItems', foodItemsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
