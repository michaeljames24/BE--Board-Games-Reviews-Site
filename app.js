const express = require('express');
const app = express();
const {
    getCategories
} = require('./controllers/get_controllers');

app.use(express.json());

// GET REQUESTS:

app.get('/api/categories', getCategories);

// ERROR HANDLING:

app.use('*', handleBadPaths);

module.exports = app;