import {HTTP_STATUSES, HttpStatusType} from "../../src/types/httpStatuses";
// @ts-ignore
import request from 'supertest'
import {app} from "../../src/app";
import {postInputDataModelForExistingBlog} from "../../src/types/post-types";


export const postsTestManager = {
    async createBlogAndPostForHim(data: postInputDataModelForExistingBlog, blogId: string, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const dataPost = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: blogId,
        }
        const response = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(dataPost)
            .expect(expectedStatusCode)
        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: dataPost.title,
                shortDescription: dataPost.shortDescription,
                content: dataPost.content,
                blogId: blogId,
                blogName: createdEntity.blogName,
                createdAt: expect.any(String)
            })
        }
        return {response, createdEntity}
    }
}
