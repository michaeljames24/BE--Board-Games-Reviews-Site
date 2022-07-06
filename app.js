const express = require('express');
const app = express();
const {getCategories, getReviews, getReviewByID, getUsers} = require('./controllers/get_controllers');
const {patchReview} = require('./controllers/patch_controllers');
const {postComment} = require('./controllers/post_controllers');
const {handleBadPaths, handlePSQLErrors, handleCustomErrors} = require('./errors/errors');

app.use(express.json());

// GET REQUESTS:

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewByID);
app.get('/api/users', getUsers);

// PATCH REQUESTS:

app.patch('/api/reviews/:review_id', patchReview);

// POST REQUESTS:

app.post('/api/reviews/:review_id/comments', postComment);

// ERROR HANDLING:

app.use('*', handleBadPaths);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

module.exports = app;