// @ts-ignore
import request from 'supertest'
import {app} from '../../src/app';
// @ts-ignore
import {blogsTestManager} from '../utils/blog.testManager';
import {faker} from "@faker-js/faker";
import {postsTestManager} from "../utils/post.testManager";
import {postInputDataModelForExistingBlog} from "../../src/types/post-types";
import mongoose from 'mongoose'

const blogInputData = {
    name: faker.person.firstName(),
    websiteUrl: faker.internet.url(),
    description: faker.person.jobDescriptor(),
}
const postsInputData: postInputDataModelForExistingBlog = {
    title: faker.internet.displayName(),
    shortDescription: faker.commerce.product(),
    content: faker.commerce.productDescription(),
}
const dbName = 'home_works'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;

describe('Blogs router', () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI);
        await request(app).delete('/testing/all-data')
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })


    describe('Blogs router GET method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('should return 200 and empty array blogs', async () => {
            await request(app)
                .get('/blogs')
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        })
        it('should get blog by id', async () => {
            let result = await blogsTestManager.createBlog(blogInputData)
            const getBlogResponse = await request(app).get(`/blogs/${result.createdEntity.id}`)
            expect(getBlogResponse.status).toBe(200)
            const blogFromAPi = getBlogResponse.body
            expect(blogFromAPi).toEqual(result.response.body)
        })
        it('should get non-existent blog and return 404', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            const getBlogResponse = await request(app).get(`/blogs/${randomNumber}`)
            expect(getBlogResponse.status).toBe(404)
        })
        it('should get post by blog id', async () => {
            let result = await blogsTestManager.createBlog(blogInputData)
            const post = await postsTestManager.createBlogAndPostForHim(postsInputData, result.createdEntity.id, 201)

            let randomNumber = '6348acd2e1a47ca32e79f46f';
            const getWrongBlogResponse = await request(app).get(`/blogs/${randomNumber}/posts`)
            expect(getWrongBlogResponse.status).toBe(404)

            const getBlogResponse = await request(app).get(`/blogs/${result.createdEntity.id}/posts`)
            expect(getBlogResponse.status).toBe(200)
            const blogFromAPi = getBlogResponse.body
            expect(blogFromAPi).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [post.createdEntity]
            })
        })
    })

    describe('Blogs router DELETE method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('should delete unexciting blog by id and return 404', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            await request(app)
                .delete(`/blogs/${randomNumber}`)
                .auth('admin', 'qwerty')
                .expect(404)
        })
        it('should delete  blog by id unauthorized and return 401 ', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            await request(app)
                .delete(`/blogs/${randomNumber}`)
                .expect(401)
        })
        it('should delete blog by id', async () => {
            let result = await blogsTestManager.createBlog(blogInputData)
            await request(app)
                .delete('/blogs/' + result.createdEntity.id)
                .auth('admin', 'qwerty')
                .expect(204)

            await request(app)
                .get('/blogs')
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        })
    })

    describe('Blogs router POST method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('try add post by unauthorized user and return 401', async () => {
            const blogInputData = {
                name: "Vasyliy Pupkin",
                websiteUrl: "https://vk.com/55",
                description: "teacher"
            }
            const response = await request(app)
                .post('/blogs')
                .send(blogInputData)
                .expect(401)
        })
        it('should return 201 status and add new blog', async () => {
            await blogsTestManager.createBlog(blogInputData)
        })
        it('try add new blog with wrong data and get 400', async () => {
            const blogInputData = {
                name: "Vasyliy Pupkin",
                websiteUrl: "httppppps://vk.com/55",
                description: "teacher",
                createdAt: new Date().toISOString(),
                isMembership: false
            }
            await blogsTestManager.createBlog(blogInputData, 400)
        })
        it('should post a new post for current blog id', async () => {
            let result = await blogsTestManager.createBlog(blogInputData)
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            const dataPost = {
                title: postsInputData.title,
                shortDescription: postsInputData.shortDescription,
                content: postsInputData.content,
                blogId: result.createdEntity.id,
            }
            await request(app)
                .post(`/blogs/${result.createdEntity.id}/posts`)
                .send(dataPost)
                .expect(401)
            await request(app)
                .post(`/blogs/${randomNumber}/posts`)
                .auth('admin', 'qwerty')
                .send(dataPost)
                .expect(404)

            const resp = await request(app)
                .post(`/blogs/${result.createdEntity.id}/posts`)
                .auth('admin', 'qwerty')
                .send(dataPost)
                .expect(201)
            console.log('here!!!!', resp.body)

            expect(resp.body).toEqual({
                id: expect.any(String),
                title: dataPost.title,
                shortDescription: dataPost.shortDescription,
                content: dataPost.content,
                blogId: result.createdEntity.id,
                blogName: result.createdEntity.name,
                createdAt: expect.any(String)
            });


        })
    })

    describe('Blogs router PUT method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('should return 204 status and  change blog', async () => {
            const result = await blogsTestManager.createBlog(blogInputData)
            const resp = await request(app)
                .put('/blogs/' + result.createdEntity.id)
                .auth('admin', 'qwerty')
                .send({
                    name: "Nikolay Durov",
                    websiteUrl: "https://vk.com",
                    description: "it programming man",
                    createdAt: new Date().toISOString(),
                    isMembership: false
                })
            expect(resp.status).toBe(204)
            const updateBlogInputData = {
                id: result.createdEntity.id,
                name: "Nikolay Durov",
                websiteUrl: "https://vk.com",
                description: "it programming man",
                createdAt: result.createdEntity.createdAt,
                isMembership: false
            }

            await request(app)
                .get('/blogs')
                .expect(200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [updateBlogInputData]
                })

        })
        it('try change blog unauthorized and return 401', async () => {
            const result = await blogsTestManager.createBlog(blogInputData)
            const resp = await request(app)
                .put('/blogs/' + result.createdEntity.id)
                .send({
                    name: "Nikolay Durov",
                    websiteUrl: "https://vk.com",
                    description: "it programming man"
                })
            expect(resp.status).toBe(401)
        })
        it('should return 400 status and try change blog by wrong data', async () => {
            const result = await blogsTestManager.createBlog(blogInputData)
            const resp = await request(app)
                .put('/blogs/' + result.createdEntity.id)
                .auth('admin', 'qwerty')
                .send({
                    name: "Nikolay Durov",
                    websiteUrl: "httjkdfngaps://vk.com",
                    description: "it programming man"
                })
            expect(resp.status).toBe(400)
        })
        it('try change non-exist blog and return 404', async () => {
            let randomNumber = '6348acd2e1a47ca32e79f46f';
            const resp = await request(app)
                .put(`/blogs/${randomNumber}`)
                .auth('admin', 'qwerty')
                .send({
                    name: "Nikolay Durov",
                    websiteUrl: "https://vk.com",
                    description: "it programming man"
                })
            expect(resp.status).toBe(404)
        })
    })
})