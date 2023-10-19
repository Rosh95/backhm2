// @ts-ignore
import request from 'supertest';
import {app} from '../../src/app';
import {BlogInputModel} from '../../src/types/blog-types';
import {postInputDataModelForExistingBlog} from '../../src/types/post-types';
import {postQueryRepository} from "../../src/repositories/post/post-query-repository";
import {faker} from "@faker-js/faker";
import {blogsTestManager} from "../utils/blog.testManager";
import {postsTestManager} from "../utils/post.testManager";
import mongoose from "mongoose";

const postsInputData: postInputDataModelForExistingBlog = {
    title: faker.internet.displayName(),
    shortDescription: faker.commerce.product(),
    content: faker.commerce.productDescription(),
}
const blogInputData: BlogInputModel = {
    name: faker.person.firstName(),
    websiteUrl: faker.internet.url(),
    description: faker.person.jobDescriptor(),
}
const dbName = 'home_works'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;
describe('Posts router', () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI);
        await request(app).delete('/testing/all-data')
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
    describe('Posts router GET method', () => {
        it('should return 200 and empty array posts', async () => {
            await request(app)
                .get('/posts')
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        })
        it('should return 201 status and add new post', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 201)
        })
        it('should get post by id', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            const post = await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 201)
            const getPostResponse = await request(app).get(`/posts/${post.createdEntity.id}`)
            expect(getPostResponse.status).toBe(200)
            const postFromAPi = getPostResponse.body
            expect(postFromAPi).toEqual(post.createdEntity)
        })
        it('should get non-existent post and return 404', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            const getPostResponse = await request(app).get(`/posts/${randomNumber}`)
            expect(getPostResponse.status).toBe(404)
        })
    })
    describe('Posts router DELETE method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('should delete unexciting posts by id and return 404', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            await request(app)
                .delete(`/posts/${randomNumber}`)
                .auth('admin', 'qwerty')
                .expect(404)
        })
        it('should delete  blog by id unauthorized and return 401 ', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            await request(app)
                .delete(`/posts/${randomNumber}`)
                .expect(401)
        })
        it('should delete post by id', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            const post = await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 201)

            await request(app)
                .delete('/posts/' + post.createdEntity.id)
                .auth('admin', 'qwerty')
                .expect(204)

            await request(app)
                .get('/posts')
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        })
    })
    describe('Posts router POST method', () => {
        // beforeAll(async () => {
        //     await request(app).delete('/testing/all-data')
        // })
        it('try add post by unauthorized user and return 401', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            let response = await request(app)
                .post('/blogs')
                .send(postsInputData);
            expect(response.status).toBe(401)
        })
        it('try add new blog with wrong data and get 400', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            const postsInputData = {
                title: 587,
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: createdEntity.id,
            }
            // @ts-ignore
            const {response} = await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 400)
            expect(response.status).toBe(400)
        })
    })
    describe('Posts router PUT method', () => {
        it('should delete all blogs', async () => {
            await request(app).delete('/testing/all-data');
            await request(app)
                .get('/posts')
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        })
        it('should return 204 status and  change post', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            const post = await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 201)

            const resp = await request(app)
                .put('/posts/' + post.createdEntity.id)
                .auth('admin', 'qwerty')
                .send({
                    title: 'Women',
                    shortDescription: 'How to sleep with 1000 women?',
                    content: 'Just born in Billionare family',
                    blogId: createdEntity.id,
                })
            expect(resp.status).toBe(204)
            let getUpdatePost = await postQueryRepository.findPostById(post.createdEntity.id)
            await request(app)
                .get('/posts')
                .expect(200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [getUpdatePost]
                })
        })
        it('try change post unauthorized and return 401', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            const post = await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 201)

            const resp = await request(app)
                .put('/posts/' + post.createdEntity.id)
                .send({
                    title: 'Sport',
                    shortDescription: 'How to be Fit?',
                    content: 'Just go to fu**cking gym and eat healthy men',
                    blogId: '2',
                    blogName: 'sport'
                })
            expect(resp.status).toBe(401)
        })
        it('should return 400 status and try change post by wrong data', async () => {
            const {createdEntity} = await blogsTestManager.createBlog(blogInputData)
            const post = await postsTestManager.createBlogAndPostForHim(postsInputData, createdEntity.id, 201)
            const resp = await request(app)
                .put('/posts/' + post.createdEntity.id)
                .send({
                    title: 'Sport',
                    shortDescription: 7777,
                    content: 'Just go to fu**cking gym and eat healthy men',
                    blogId: '2',
                    blogName: 'sport'
                })
                .auth('admin', 'qwerty')
            expect(resp.status).toBe(400)

        })
        it('try change  non-exist blog and return 400', async () => {
            let randomNumber = 561649849;
            const resp = await request(app)
                .put('/posts/' + randomNumber)
                .send({
                    title: 'Sport',
                    shortDescription: 'How to be fit?',
                    content: 'Just go to fu**cking gym and eat healthy men',
                    blogId: '252565',
                    blogName: 'sport'
                })
                .auth('admin', 'qwerty')
            expect(resp.status).toBe(400)
        })
    })
})