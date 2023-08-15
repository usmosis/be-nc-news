const app = require ("../app")
const request = require('supertest')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const endpointsJSON = require('../endpoints.json')
require('jest-sorted')


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
            expect(endPoints).toEqual(endpointsJSON)
        })
    })
})

describe ('GET: /api/articles/:article_id', () => {
    it('200: responds with correct status code and an article object with correct shape', () => {
        return request(app).get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article.article_id).toEqual(1)
            expect(article.author).toEqual('butter_bridge')
            expect(article.title).toEqual('Living in the shadow of a great man')
            expect(article.body).toEqual('I find this existence challenging')
            expect(article.topic).toEqual('mitch')
            expect(typeof article.created_at).toBe("string")
            expect(article.votes).toEqual(100)
            expect(article.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    });
    it('GET:404 sends an appropriate error message when given a valid but non-existent article_id', () => {
        return request(app).get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Not found")
        })
    });
    it('GET:400 sends an appropriate error message when given an invalid article_id', () => {
        return request(app).get('/api/articles/dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad request')
        })
    })
})

describe('GET: /api/articles', () => {
    it('200: responds with an array of articles and correct status code', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy('created_at', {descending: true})
            articles.forEach(article => {
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
            })
        })
    });
});