const {updateReview} = require('../models/patch_models');

exports.patchReview = (req, res, next) => {
    const { inc_votes } = req.body;
    const { review_id } = req.params;

    if (!inc_votes) {next({status: 400, message: "Invalid input object."})}
    else {
        updateReview(inc_votes, review_id)
        .then(review => {
            if (!review[0]) {next({status: 404, message: "That Review ID doesn't exist."});}
            else {res.status(200).send({review: review[0]});}
        })
        .catch(err => {
            next(err);
        });
    }
}