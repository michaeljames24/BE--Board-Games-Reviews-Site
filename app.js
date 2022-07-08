const express = require('express');
const app = express();
const db = require('../db/connection');
const {getCategories, getReviews, getReviewByID, getReviewComments, getUsers} = require('./controllers/get_controllers');
const {patchReview} = require('./controllers/patch_controllers');
const {postComment} = require('./controllers/post_controllers');
const {deleteComment} = require('./controllers/delete_controllers');
const {handleBadPaths, handlePSQLErrors, handleCustomErrors} = require('./errors/errors');
const endpoints = require('./endpoints.json');

app.use(express.json());

// GET REQUESTS:

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewByID);
app.get('/api/reviews/:review_id/comments', getReviewComments);
app.get('/api/users', getUsers);

// PATCH REQUESTS:

app.patch('/api/reviews/:review_id', patchReview);

// POST REQUESTS:

app.post('/api/reviews/:review_id/comments', postComment);

// DELETE REQUESTS:

app.delete('/api/comments/:comment_id', deleteComment);

// GET ENDPOINTS.JSON:

app.get('/api', (req,res) => {return res.status(200).send({endpoints})});

// ERROR HANDLING:

app.use('*', handleBadPaths);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

module.exports = app;