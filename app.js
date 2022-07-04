const express = require('express');
const app = express();
const {
    getCategories,
    getReviewByID
} = require('./controllers/get_controllers');
const {
    handleBadPaths
} = require('./errors/errors');

app.use(express.json());

// GET REQUESTS:

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewByID);

// ERROR HANDLING:

app.use('*', handleBadPaths);

module.exports = app;