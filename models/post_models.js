const db = require('../db/connection');

exports.insertComment = (review_id, username, body) => {
    return db.query(`
    INSERT INTO comments (review_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [review_id, username, body])
    .then(comment => {
        return comment.rows[0];
    })
}