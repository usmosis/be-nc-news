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
    it("200: able to take a filter query that filteres articles by topic", () => {
        return request(app).get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            articles.forEach((article) => {
                expect(article.topic).toBe("mitch")
            })
        })
    })
    it("404: responds with appropriate error when given an invalid topic", () => {
        return request(app)
        .get('/api/articles?topic=match')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Not found")
        })
    })
    it("200: able to take a sort_by query that sorts by...", () => {
        return request(app).get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSortedBy("votes", {descending: true})
            })
        })
    })
    it("400: responds with appropriate error when given an invalid sort_by", () => {
        return request(app)
        .get('/api/articles?sort_by=dog&order=desc')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Bad request")
        })
    })
    it("200: able to take an order query that orders ascending or descending", () => {
        return request(app).get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSortedBy("votes", {ascending: true})
            })
        })

    it("400: responds with appropriate error when given an invalid order", () => {
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=created_at&order=misc')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Bad request")
        })
    })

describe('GET: /api/articles/:article_id/comments', () => {
    it("200: responds with all comments relating to particular article with article_id", () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments.length).toBe(11)
            expect(comments).toBeSortedBy('created_at', {descending: true})
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('article_id')
                expect(comment).toHaveProperty('created_at')
            })
        })
    })
    it("200: responds with an empty array if article exists but has no comments", () => {
        return request(app).get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments).toEqual([])
        })
    })
    it("GET:404 sends an appropriate error message when given a valid but non-existent article_id", () => {
        return request(app).get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Not found')
        })
    })
    it("GET:400 sends an appropriate error message when given an invalid article_id", () => {
        return request(app).get('/api/articles/dog/comments')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Bad request")
        })
    })
});
describe('POST: /api/articles/:article_id/comments', () => {
    it('201: responds with correct status and adds a comment object to article with correct properties (username and body)', () => {

        const newComment = {username: 'butter_bridge', body: 'this is a comment'}
        return request(app).post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const {comment} = body;
            expect(comment).toMatchObject({comment_id: 19, article_id:1, votes:0, author: 'butter_bridge', body: 'this is a comment'})
        })
    });
    it('201: ignores any extra keys and responds with comment and correct status code', () => {
        const newComment = {fruit: 'apple', username: 'butter_bridge', body: 'this is a comment'}
        return request(app).post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const {comment} = body;
            expect(comment).toMatchObject({comment_id: 19, article_id:1, votes:0, author: 'butter_bridge', body: 'this is a comment'})
        })
    });
    it('404: sends an appropriate error message when username is invalid', () => {
        const newComment = {username: 'buttery_bridge', body: 'this is a comment'}
        return request(app).post('/api/articles/1/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Not found')

        })
    });
    it('404: sends an appropriate error message when given a valid but non existent article_id', () => {
        const newComment = {username: 'butter_bridge', body: 'this is a comment'}
        return request(app).post('/api/articles/999/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Not found')
        })
    })
    it('400: sends an appropriate error message when given an invalid article_id', () => {
        const newComment = {username: 'butter_bridge', body: 'this is a comment'}
        return request(app).post('/api/articles/dog/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad request')
        })
    });
    it('400: sends an appropriate error message when we do not receive a username or a body', () => {
        const newComment = {username: "butter_bridge"}
        return request(app).post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad request')
        })
    });
});
describe('PATCH: /api/articles/:article_id', () => {
    it('200: responds with an updated article that has new vote value', () => {
        let newVote = -99
        const voteUpdate = {inc_votes: newVote}
        return request(app).patch('/api/articles/1')
        .send(voteUpdate)
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toMatchObject({title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 1,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"})
        })
    });
    it('404: responds with an appropriate error when given a valid but non existent article_id', () => {
        let newVote = -99
        const voteUpdate = {inc_votes: newVote}
        return request(app).patch('/api/articles/999')
        .send(voteUpdate)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Not found")
        })
    })
    it('400: responds with an appropriate error when given an invalid value for newVote', () => {
        let newVote = 'apple'
        const voteUpdate = {inc_votes: newVote}
        return request(app).patch('/api/articles/1')
        .send(voteUpdate)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Bad request")
        })
    });
    it('400: responds with an appropriate error when given an invalid article_id', () => {
        let newVote = -99
        const voteUpdate = {inc_votes: newVote}
        return request(app).patch('/api/articles/dog')
        .send(voteUpdate)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Bad request")
        })
    });
});

describe('DELETE: /api/comments/:comment_id', () => {
    it('204: removes the specified comment and responds with correct status code', () => {
        return request(app).delete('/api/comments/1')
        .expect(204)
            
        })
    });
    it("404: responds with appropriate error message when given a valid but non-existent comment_id", () => {
        return request(app).delete('/api/comments/999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Not found")
        })
    })
    it("400: responds with appropriate error message when given an invalid comment_id", () => {
        return request(app).delete('/api/comments/dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Bad request")
        })
    })

describe('GET: /api/users', () => {
    it('200: responds with an array of all users ', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users).toHaveLength(4)
            users.forEach(user => {
                expect(user).toHaveProperty("username")
                expect(user).toHaveProperty("name")
                expect(user).toHaveProperty("avatar_url")
            })
        })
    });
});

