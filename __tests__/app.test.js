const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
})

describe("GET /api/categories requests.", () => {

    test("Responds with an array of objects, each of which contain 'slug' and 'description' properties.", () => {
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

describe("GET /api/reviews/:review_id requests.", () => {

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
                votes: 5
            })
        })
    })

})


describe("PATCH /api/reviews requests.", () => {

    test("Returns an object with a key of 'review', containing the review that was updated.", () => {
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

describe("Errors: Bad paths.", () => {

    test("Responds to bad categories path with 404 status and relevant message.", () => {
        return request(app).get('/api/category')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("That page does not exist.");
        })
    })

    test("Responds to bad reviews path with 404 status and relevant message.", () => {
        return request(app).get('/api/reveiws/2')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("That page does not exist.");
        })
    })

})

describe("Errors: Valid but non-existent paths.", () => {

    test("GET request: Responds to valid but non-existent Review ID with 404 status and relevant message.", () => {
        return request(app).get('/api/reviews/1000')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("That Review ID doesn't exist.");
        })
    })

    test("PATCH request: Responds to valid but non-existent Review ID with 404 status and relevant message.", () => {
        return request(app).patch('/api/reviews/1000')
        .expect(404)
        .send({ inc_votes: 5 })
        .then(({body}) => {
            expect(body.message).toBe("That Review ID doesn't exist.");
        })
    })

})

describe("Errors: Invalid paths/ input objects.", () => {

    test("Responds to invalid Review ID with 400 status and relevant message.", () => {
        return request(app).get('/api/reviews/apple')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Invalid Review ID or input object.");
        })
    })

    test("Responds to invalid input on patch request with 400 status and relevant message.", () => {
        return request(app).patch('/api/reviews/2')
        .expect(400)
        .send({ inc_votes: 'A' })
        .then(({body}) => {
            expect(body.message).toBe("Invalid Review ID or input object.");
        })
    })

    test("Responds to empty object on patch request with 400 status and relevant message.", () => {
        return request(app).patch('/api/reviews/2')
        .expect(400)
        .send({})
        .then(({body}) => {
            expect(body.message).toBe("Invalid input object.");
        })
    })

})