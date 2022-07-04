const {
    fetchCategories,
    fetchReviewByID
} = require('../models/get_models');

exports.getCategories = (req, res) => {
    fetchCategories()
    .then(categories => {
        res.status(200).send(categories);
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