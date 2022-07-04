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

describe("GET/api/categories requests.", () => {
    test("Responds with an array of objects, each of which contain 'slug' and 'description' properties.", () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object");
            body.forEach(category => {
                expect(category.slug).toEqual(expect.any(String));
                expect(category.description).toEqual(expect.any(String));
            })
        })
    })
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

describe("Error handling.", () => {
    test("Responds to bad paths with 404 status and relevant message.", () => {
        return request(app).get('/api/category')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("That page does not exist.");
        })
    })
    test("Responds to valid-but-non-existent paths with 404 status and relevant message.", () => {
        return request(app).get('/api/reviews/1000')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("That Review ID doesn't exist.");
        })
    })
    test("Responds to invalid paths with 404 status and relevant message.", () => {
        return request(app).get('/api/reviews/apple')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Invalid Review ID.");
        })
    })
})