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

exports.fetchReviews = () => {
    return db.query(`
    SELECT reviews.*, CAST(COUNT(comments.review_id) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
    `)
    .then(reviews => {
        return reviews.rows;
    })
}

exports.fetchReviewByID = (reviewID) => {
    return db.query(`
    SELECT reviews.*, CAST(COUNT(comments.review_id) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
    `, [reviewID])
    .then(review => {
        return review.rows[0];
    })
}

exports.checkReviewExists = (review_id) => {
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1;
    `, [review_id])
    .then(review => {
        return review.rows.length === 0 ? false : true;
    })
    .catch(err => {
        return err;
    })
}

exports.fetchReviewComments = (reviewID) => {
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1;
    `, [reviewID])
    .then(comments => {
        return comments.rows;
    })
}