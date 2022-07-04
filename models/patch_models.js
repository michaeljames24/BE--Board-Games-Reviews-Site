const db = require('../db/connection');

exports.updateReview = (inc_votes, review_id) => {
    return db.query(`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;    
    `, [inc_votes, review_id])
    .then(review => {
        return review.rows;
    })
}