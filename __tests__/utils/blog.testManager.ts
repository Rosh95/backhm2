import {BlogInputModel} from "../../src/types/blog-types";
import {app} from "../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../src/types/httpStatuses";
// @ts-ignore
import request from 'supertest'


export const blogsTestManager = {
    async createBlog(data: BlogInputModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const blogData = {
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const response = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(blogData)
            .expect(expectedStatusCode)
        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body
            expect(createdEntity).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
        }
        return {response, createdEntity}
    }
}
