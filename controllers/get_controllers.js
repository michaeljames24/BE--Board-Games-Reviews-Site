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

exports.getReviewByID = (req, res) => {
    const { review_id } = req.params;
    fetchReviewByID(review_id)
    .then(review => {
        res.status(200).send({review});
    })
}