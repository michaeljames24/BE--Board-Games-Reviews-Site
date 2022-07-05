const {updateReview} = require('../models/patch_models');

exports.patchReview = (req, res, next) => {
    const { inc_votes } = req.body;
    const { review_id } = req.params;
    updateReview(inc_votes, review_id)
    .then(review => {
        res.status(200).send(review[0]);
    })
    .catch(err => {
        next(err);
    });
}