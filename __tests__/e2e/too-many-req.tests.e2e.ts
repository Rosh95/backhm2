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
import {config} from 'dotenv'
config()

const dbName = 'home_works'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;


const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));
describe('429 tests', () => {
    jest.setTimeout(30 * 1000)
    const countOfAcceptableConnections = 5
    const timeout = 10
    const status = 429
    beforeAll(async () => {
        /* Connecting to the database. */
        try {
            await mongoose.connect(mongoURI);
            await request(app).delete('/testing/all-data')
        } catch (e) {
            console.log('err connect')
        }

    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    it('should return 429 status code', async () => {
        for (let i = 0; i < countOfAcceptableConnections + 1; i++) {
            const res = await request(app).post('/auth/new-password').send()
            if(i < countOfAcceptableConnections){
                expect(res.status).not.toBe(status)
            } else {
                expect(res.status).toBe(status)
            }
        }
        await sleep(10)
        const res = await request(app).post('/auth/new-password').send()
        expect(res.status).not.toBe(status)
    });
})