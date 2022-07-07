const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
require('jest-sorted');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
})

describe("GET /api/categories endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Responds with an array of objects, each of which contains 'slug' and 'description' properties.", () => {
            return request(app).get('/api/categories')
            .expect(200)
            .then(({body}) => {
                body.forEach(category => {
                    expect(category.slug).toEqual(expect.any(String));
                    expect(category.description).toEqual(expect.any(String));
                })
            })
        })

    })

    describe("Error handling tests:", () => {

        test("Responds to invalid categories path with 404 status and 'That page does not exist' message.", () => {
            return request(app).get('/api/category')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That page does not exist.");
            })
        })

    })

})

describe("GET /api/users endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Responds with an array of four objects, each of which contains the correct three properties.", () => {
            return request(app).get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(4);
                body.forEach(user => {
                    expect(user.username).toEqual(expect.any(String));
                    expect(user.name).toEqual(expect.any(String));
                    expect(user.avatar_url).toEqual(expect.any(String));
                })
            })
        })
    
    })

    describe("Error handling tests:", () => {

        test("Responds to invalid users path with 404 status and 'That page does not exist' message.", () => {
            return request(app).get('/api/user')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That page does not exist.");
            })
        })
    
    })

})

describe("GET /api/reviews endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Responds with an array of objects, each of which contains the correct nine properties.", () => {
            return request(app).get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(13);
                body.forEach(review => {
                    expect(review.review_id).toEqual(expect.any(Number));
                    expect(review.title).toEqual(expect.any(String));
                    expect(review.category).toEqual(expect.any(String));
                    expect(review.review_img_url).toEqual(expect.any(String));
                    expect(review.created_at).toEqual(expect.any(String));
                    expect(review.votes).toEqual(expect.any(Number));
                    expect(review.review_body).toEqual(expect.any(String));
                    expect(review.designer).toEqual(expect.any(String));
                    expect(review.comment_count).toEqual(expect.any(Number));
                })
            })
        })

        test("Responds with an array of objects sorted by creation date in descending order.", () => {
            return request(app).get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeSorted({ descending: true });
            })
        })

    })

    describe("Error handling tests:", () => {

        test("Responds to invalid reviews path with 404 status and 'That page does not exist' message.", () => {
            return request(app).get('/api/reveiws')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That page does not exist.");
            })
        })

    })

})

describe("GET /api/reviews/:review_id endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Responds with a specific review object.", () => {
            return request(app).get('/api/reviews/2')
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5,
                    comment_count: 3
                })
            })
        })

    })

    describe("Error handling tests:", () => {

        test("Responds to invalid reviews path with 404 status and 'That page does not exist' message.", () => {
            return request(app).get('/api/reveiws/2')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That page does not exist.");
            })
        })

        test("Responds to valid but non-existent Review ID with 404 status and 'That Review ID doesn't exist' message.", () => {
            return request(app).get('/api/reviews/1000')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That Review ID doesn't exist.");
            })
        })

        test("Responds to invalid Review ID with 400 status and 'Invalid Review ID or input object' message.", () => {
            return request(app).get('/api/reviews/apple')
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Invalid Review ID or input object.");
            })
        })

    })

})

describe("GET /api/reviews/:review_id/comments endpoint.", () => {

    describe("Functionality tests:", () => {

        test.only("Returns an array of comments for the specified review, each containing the correct six properties.", () => {
            return request(app).get('/api/reviews/2/comments')
            .expect(200)
            .then(({body}) => {
                console.log(body);
                expect(body.comments.length).toBe(3);
                body.comments.forEach(comment => {
                    expect(comment.comment_id).toEqual(expect.any(Number));
                    expect(comment.votes).toEqual(expect.any(Number));
                    expect(comment.created_at).toEqual(expect.any(String));
                    expect(comment.author).toEqual(expect.any(String));
                    expect(comment.body).toEqual(expect.any(String));
                    expect(comment.review_id).toEqual(expect.any(Number));
                })
            })
            
        })

        test("If review has no comments, returns an empty array.", () => {
            return request(app).get('/api/reviews/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([]);
            })
        })
    
    })

    describe("Error handling tests:", () => {

        test("Responds to invalid review comments path with 404 status and 'That page does not exist' message.", () => {
            return request(app).get('/api/reviews/2/comment')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That page does not exist.");
            })
        })

        test("Responds to valid but non-existent Review ID with 404 status and 'That review does not exist' message.", () => {
            return request(app).get('/api/reviews/1000/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That review does not exist.");
            })
        })

        test("Responds to invalid Review ID with 400 status and 'Invalid Review ID or input object' message.", () => {
            return request(app).get('/api/reviews/apple/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Invalid Review ID or input object.");
            })
        })

    })

})

describe("GET /api/reviews QUERIES endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Sorts reviews by date in descending order if no sort_by or order queries are provided.", () => {
            return request(app).get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(13);
                expect(body).toBeSortedBy('created_at', { descending: true });
            })
        })

        test("Sorts reviews by sort_by query if provided, in descending order by default.", () => {
            return request(app).get('/api/reviews?sort_by=votes')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(13);
                expect(body).toBeSortedBy('votes', { descending: true });
            })
        })

        test("Orders results in ascending order if order query specifies this (sorting by created_at by default).", () => {
            return request(app).get('/api/reviews?order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(13);
                expect(body).toBeSortedBy('created_at');
            })
        })

        test("Sorts reviews AND orders in ascending order if both sort_by and order queries provided.", () => {
            return request(app).get('/api/reviews?sort_by=votes&order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(13);
                expect(body).toBeSortedBy('votes');
            })
        })

        test("Filters results by category if category query is present.", () => {
            return request(app).get('/api/reviews?category=euro_game')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(1);
                expect(body[0].title).toBe("Agricola");
            })
        })

        test("Returns empty array if specified category exists but has no reviews.", () => {
            return request(app).get("/api/reviews?category=children's_games")
            .expect(200)
            .then(({body}) => {
                expect(body).toEqual([]);
            })
        })

        test("Sorts, orders and filters if all three queries are provided.", () => {
            return request(app).get('/api/reviews?sort_by=votes&order=asc&category=social_deduction')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(11);
                expect(body).toBeSortedBy('votes', { descending: false });
                body.forEach(review => {
                    expect(review.category).toBe("social deduction");
                })
            })
        })
    
    })

    describe("Error handling tests:", () => {

        test("Sends 404 and 'That column does not exist' message if specified sort_by column doesn't exist.", () => {
            return request(app).get('/api/reviews?sort_by=non_existent_column')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That column does not exist.");
            })
        })

        test("Sends 404 and 'That category does not exist' message if specified category doesn't exist.", () => {
            return request(app).get('/api/reviews?category=non_existent_category')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("That category does not exist.");
            })
        })

    })

})

describe("PATCH /api/reviews/:review_id endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Returns an object with a key of 'review' containing the review object that was updated.", () => {
            return request(app).patch('/api/reviews/2')
            .expect(200)
            .send({ inc_votes: 5 })
            .then(({body}) => {
                expect(body.review).toEqual(
                    expect.objectContaining({
                        title: 'Jenga',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Fiddly fun for all the family',
                        category: 'dexterity',
                        created_at: '2021-01-18T10:01:41.251Z'
                    })
                )
            })
        })
    
        test("Increments the specified reviews 'votes' value by the input amount.", () => {
            return request(app).patch('/api/reviews/2')
            .expect(200)
            .send({ inc_votes: 5 })
            .then(({body}) => {
                expect(body.review.votes).toBe(10);
            })
        })
    
    })

    describe("Error handling tests:", () => {

        test("Responds to valid but non-existent Review ID with 404 status and 'That Review ID doesn't exist' message.", () => {
            return request(app).patch('/api/reviews/1000')
            .expect(404)
            .send({ inc_votes: 5 })
            .then(({body}) => {
                expect(body.message).toBe("That Review ID doesn't exist.");
            })
        })

        test("Responds to invalid Review ID with 400 status and 'Invalid Review ID or input object' message.", () => {
            return request(app).patch('/api/reviews/ABC')
            .expect(400)
            .send({ inc_votes: 5 })
            .then(({body}) => {
                expect(body.message).toBe("Invalid Review ID or input object.");
            })
        })

        test("Responds to invalid inc_votes value on input object with 400 status and 'Invalid Review ID or input object' message.", () => {
            return request(app).patch('/api/reviews/2')
            .expect(400)
            .send({ inc_votes: 'A' })
            .then(({body}) => {
                expect(body.message).toBe("Invalid Review ID or input object.");
            })
        })

        test("Responds to empty input object with 400 status and 'Invalid input object' message.", () => {
            return request(app).patch('/api/reviews/2')
            .expect(400)
            .send({})
            .then(({body}) => {
                expect(body.message).toBe("Invalid input object.");
            })
        })

    })

})

describe("POST /api/reviews/:review_id/comments endpoint.", () => {

    describe("Functionality tests:", () => {

        test("Returns an object with a key of 'comment' containing the comment object that was created (complete with six standard properties).", () => {
            return request(app).post('/api/reviews/10/comments')
            .expect(201)
            .send( {username: 'philippaclaire9', body: "Sounds great. You've sold it to me!"} )
            .then(({body}) => {
                expect(body.comment.author).toEqual('philippaclaire9');
                expect(body.comment.body).toEqual("Sounds great. You've sold it to me!");
                expect(body.comment.comment_id).toBe(7);
                expect(body.comment.votes).toBe(0);
                expect(body.comment.review_id).toBe(10);
                expect(body.comment.created_at).toEqual(expect.any(String));
            })
        })

    })

    describe("Error handling tests:", () => {

        test("Responds to valid but non-existent Review ID with 404 status and 'That Review ID doesn't exist' message.", () => {
            return request(app).post('/api/reviews/1000/comments')
            .expect(404)
            .send( {username: 'philippaclaire9', body: "Sounds great. You've sold it to me!"} )
            .then(({body}) => {
                expect(body.message).toBe("That Review ID does not exist.");
            })
        })

        test("Responds to invalid Review ID with 400 status and 'Invalid Review ID or input object' message.", () => {
            return request(app).post('/api/reviews/apple/comments')
            .expect(400)
            .send( {username: 'philippaclaire9', body: "Sounds great. You've sold it to me!"} )
            .then(({body}) => {
                expect(body.message).toBe("Invalid Review ID or input object.");
            })
        })

        test("Responds to empty input object with 400 status and 'Invalid input object' message.", () => {
            return request(app).post('/api/reviews/10/comments')
            .expect(400)
            .send({})
            .then(({body}) => {
                expect(body.message).toBe("Invalid input object.");
            })
        })

        test("If username isn't already in users table, returns 400 status and 'Username does not exist' message.", () => {
            return request(app).post('/api/reviews/10/comments')
            .expect(400)
            .send({ username: "michaeljames24", body: "Sounds great. You've sold it to me!" })
            .then(({body}) => {
                expect(body.message).toBe("Username does not exist.");
            })
        })

    })

})

// describe.only("GET /api endpoint.", () => {

//     describe("Functionality tests:", () => {

//         test("Responds with JSON object containing overview of all available endpoints.", () => {
//             return request(app).get('/api')
//             .expect(200)
//             .then((endpoints) =>{
//                 console.log(endpoints);
//             })
//         })

//     })

    // describe("Error handling tests:", () => {

    //     test("Returns 404 and 'Comment not found' message if specified comment does not exist.", () => {
    //         return request(app).delete('/api/comments/100')
    //         .expect(404)
    //         .then(({body}) => {
    //             expect(body.message).toBe("Comment not found.");
    //         })
    //     })

//     // })

// })