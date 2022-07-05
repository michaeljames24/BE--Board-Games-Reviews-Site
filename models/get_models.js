const db = require('../db/connection');

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories`)
    .then(categories => {
        return categories.rows;
    });
}

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(users => {
        return users.rows;
    });
}

exports.fetchReviewByID = (reviewID) => {
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1
    `, [reviewID])
    .then(review => {
        return review.rows[0];
    })
}