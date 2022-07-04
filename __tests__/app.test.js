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
})

describe("Error handling.", () => {
    test("Responds to bad paths with 404 status and descriptive message.", () => {
        return request(app).get('/api/category')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("That page does not exist.");
        })
    })
})