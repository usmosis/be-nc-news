const app = require ("../app")
const request = require('supertest')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const endpointsJSON = require('../endpoints.json')



afterAll(() => {
    db.end()
})

beforeEach(() => {
    
   return seed(testData);
})

describe('GET: /api/topics', () => {
    it('200: gets correct status code and receives topics data', () => {
        return request(app).get('/api/topics').expect(200).then((data) => {
            const {topics} = data.body;
            expect(topics.length).toBe(3)
            topics.forEach(topic => {
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
            })
        })
    });
});

describe ('GET: /api', () => {
    it('200: serves an object describing all available endpoints on our api, with correct status code', () => {
        return request(app).get('/api').expect(200)
        .then(({body}) => {
            const {endPoints} = body
            console.log(body)
            expect(endPoints).toEqual(endpointsJSON)
        })
    })
})