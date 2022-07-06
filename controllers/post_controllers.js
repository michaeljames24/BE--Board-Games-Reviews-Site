const { insertComment } = require('../models/post_models');

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;

    insertComment(review_id, username, body)
    .then((comment) => {
        if (!comment) {return next({status: 404, message: "That Review ID doesn't exist."});}
        else {res.status(201).send({ comment });}
    })
    .catch(err => {
        next(err);
    })

}