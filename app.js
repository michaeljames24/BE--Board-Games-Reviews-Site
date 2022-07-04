const express = require('express');
const app = express();
const {getCategories} = require('./controllers/get_controllers');
const {patchReview} = require('./controllers/patch_controllers');
const {handleBadPaths} = require('./errors/errors');

app.use(express.json());

// GET REQUESTS:

app.get('/api/categories', getCategories);

// PATCH REQUESTS:

app.patch('/api/reviews/:review_id', patchReview);

// ERROR HANDLING:

app.use('*', handleBadPaths);

module.exports = app;