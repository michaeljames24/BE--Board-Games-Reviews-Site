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

exports.fetchReviews = (sort_by, order, category) => {
    const { psqlQuery, psqlArray } = constructPSQLQuery( sort_by, order, category);
    return db.query(psqlQuery, psqlArray)
    .then(reviews => {
        return reviews.rows;
    })
}

exports.checkCategoryExists = (category) => {
    category = category.toLowerCase();
    const parsedCategory = category.replace(/_/g, " ");
    return db.query(`
    SELECT * FROM categories
    WHERE slug = $1;
    `, [ parsedCategory ])
    .then(category => {
        return category.rows.length === 0 ? false : true;
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

// SUPPLEMENTARY FUNCTIONS:

function constructPSQLQuery(sort_by, order, category) {
    let psqlArray = [];
    let psqlQuery = `
    SELECT reviews.*, CAST(COUNT(comments.review_id) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    `;

    if (category) {
        category = category.toLowerCase();
        const parsedCategory = category.replace("_", " ");
        psqlQuery += `WHERE category = $1`;
        psqlArray.push(parsedCategory);
    }

    psqlQuery += `GROUP BY reviews.review_id `;

    switch (sort_by) {
        case 'title':
            psqlQuery += `ORDER BY title`;
            break;
        case 'designer':
            psqlQuery += `ORDER BY designer`;
            break;
        case 'owner':
            psqlQuery += `ORDER BY owner`;
            break;
        case 'review_img_url':
            psqlQuery += `ORDER BY review_img_url`;
            break;
        case 'review_body':
            psqlQuery += `ORDER BY review_body`;
            break;
        case 'category':
            psqlQuery += `ORDER BY category`;
            break;
        case 'created_at':
            psqlQuery += `ORDER BY created_at`;
            break;
        case 'votes':
            psqlQuery += `ORDER BY votes`;
            break;
        case undefined:
            psqlQuery += `ORDER BY created_at`;
            break;
        default:
            psqlQuery += `ORDER BY invalid_input`;
    }

    if (order) {order = order.toUpperCase();}
    psqlQuery += order === "ASC" ? ` ASC` : ` DESC`;

    return { psqlQuery, psqlArray };
}