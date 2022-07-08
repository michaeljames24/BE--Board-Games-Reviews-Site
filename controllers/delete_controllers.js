const {removeComment} = require('../models/delete_models');

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
    .then((deletedComment) => {
        if (deletedComment.rows.length !== 0) {res.status(204).send();}
        next({status: 404, message: "Comment not found."})
    })
    .catch(err => {
        next(err);
    })
}