const express = require('express');
const app = express();
const {
    getCategories
} = require('./controllers/get_controllers');
const {
    handleBadPaths
} = require('./errors/errors');

app.use(express.json());

// GET REQUESTS:

app.get('/api/categories', getCategories);

// ERROR HANDLING:

app.use('*', handleBadPaths);

module.exports = app;