const {fetchCategories, fetchReviews, fetchReviewByID, fetchReviewComments, fetchUsers} = require('../models/get_models');

exports.getCategories = (req, res) => {
    fetchCategories()
    .then(categories => {
        res.status(200).send(categories);
    })
}

exports.getUsers = (req, res) => {
    fetchUsers()
    .then(users => {
        res.status(200).send(users);
    })
}

exports.getReviews = (req, res) => {
    fetchReviews()
    .then(reviews => {
        res.status(200).send(reviews);
    })
}

exports.getReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewByID(review_id)
    .then(review => {
        if (!review) {next({status: 404, message: "That Review ID doesn't exist."});}
        else {res.status(200).send({review});}
    })
    .catch(err => {
        next(err);
    });
}

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewComments(review_id)
    .then(comments => {
        if (comments.length === 0) {next({status: 404, message: "That Review ID doesn't exist."});}
        else {res.status(200).send({comments});}
    })
    .catch(err => {
        next(err);
    });
}