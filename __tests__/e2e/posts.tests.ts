import request from 'supertest'
import {blogInputType, db, postInputType} from '../../src/db/db';
import {app} from '../../src/app';
import {postRepository} from '../../src/repositories/post-repository';
import {isBooleanObject} from 'util/types';


export const addNewBlog = async (blog: blogInputType) => {
    let response = await request(app)
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send(blog)

    return response;
}
const addNewPost = async (post: postInputType) => {
    let response = await request(app)
        .post('/posts')
        .auth('admin', 'qwerty')
        .send(post)

    return response;
}
describe('Posts router', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    describe('Posts router GET method', () => {
        it('should return 200 and empty array posts', async () => {
            await request(app)
                .get('/posts')
                .expect(200, [])
        })
        it('should return 201 status and add new blog', async () => {
            const blogInputData = {
                name: "Pavel Durov",
                websiteUrl: "https://vk.com",
                description: "it businessman"
            }

            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
            expect.setState({blog: newBlog})
        })
        it('should return 201 status and add new post', async () => {
            const {blog} = expect.getState()

            const postsInputData = {
                title: 'Money',
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: blog.id,
            }

            let response = await addNewPost(postsInputData);
            expect(response.status).toBe(201)
            const newPost = response.body
            expect(newPost).toEqual({
                id: expect.any(String),
                title: postsInputData.title,
                shortDescription: postsInputData.shortDescription,
                content: postsInputData.content,
                blogId: postsInputData.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
                // createdAt: expect.any(String)
                // isMembership: false
            })
            expect.setState({post: newPost})
        })

        it('should get post by id', async () => {
            const {post} = expect.getState()

            const getPostResponse = await request(app).get(`/posts/${post.id}`)
            expect(getPostResponse.status).toBe(200)
            const postFromAPi = getPostResponse.body
            expect(postFromAPi).toEqual(post)
        })
        it('should get non-existent post and return 404', async () => {
            let randomNumber = 1222555;
            const getPostResponse = await request(app).get(`/posts/${randomNumber}`)
            expect(getPostResponse.status).toBe(404)
        })

    })

    describe('Posts router DELETE method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('should delete unexciting posts by id and return 404', async () => {
            let randomNumber = 55555;
            await request(app)
                .delete(`/posts/${randomNumber}`)
                .auth('admin', 'qwerty')
                .expect(404)
        })
        it('should delete  blog by id unauthorized and return 401 ', async () => {
            let randomNumber = 55555;
            await request(app)
                .delete(`/posts/${randomNumber}`)
                .expect(401)
        })
        it('should return 201 status and add new blog', async () => {
            const blogInputData = {
                name: "Pavel Durov",
                websiteUrl: "https://vk.com",
                description: "it businessman"
            }

            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
                // createdAt: expect.any(String),
                // isMembership: false
            })
            expect.setState({blog: newBlog})
        })
        it('should return 201 status and add new post', async () => {
            const {blog} = expect.getState()

            const postsInputData = {
                title: 'Money',
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: blog.id,
                blogName: blog.name
            }

            let response = await addNewPost(postsInputData);
            expect(response.status).toBe(201)
            const newPost = response.body
            expect(newPost).toEqual({
                id: expect.any(String),
                title: postsInputData.title,
                shortDescription: postsInputData.shortDescription,
                content: postsInputData.content,
                blogId: postsInputData.blogId,
                blogName: postsInputData.blogName,
                createdAt: expect.any(String)
                // createdAt: expect.any(String),
                // isMembership: false
            })
            expect.setState({post: newPost})
        })
        it('should delete post by id', async () => {
            const {post} = expect.getState()

            await request(app)
                .delete('/posts/' + post.id)
                .auth('admin', 'qwerty')
                .expect(204)

            await request(app)
                .get('/posts')
                .expect(200, [])
        })
    })

    describe('Posts router POST method', () => {
        // beforeAll(async () => {
        //     await request(app).delete('/testing/all-data')
        // })
        it('should return 201 status and add new blog', async () => {
            const blogInputData = {
                name: "Pavel Durov",
                websiteUrl: "https://vk.com",
                description: "it businessman"
            }

            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
                // createdAt: expect.any(String),
                // isMembership: false
            })
            expect.setState({blog: newBlog})
        })

        it('try add post by unauthorized user and return 401', async () => {
            const {blog} = expect.getState()

            const postInputData = {
                title: 'Money',
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: blog.id,
                blogName: 'finance'
            }
            let response = await request(app)
                .post('/blogs')
                .send(postInputData);
            expect(response.status).toBe(401)
        })

        it('should return 201 status and add new post', async () => {
            const {blog} = expect.getState()

            const postsInputData = {
                title: 'Money',
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: blog.id,
            }

            let response = await addNewPost(postsInputData);
            expect(response.status).toBe(201)
            const newPost = response.body
            console.log(newPost)
            expect(newPost).toEqual({
                id: expect.any(String),
                title: postsInputData.title,
                shortDescription: postsInputData.shortDescription,
                content: postsInputData.content,
                blogId: postsInputData.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String),
                // createdAt: expect.any(String),
                // isMembership: false
            })
            expect.setState({post: newPost})
        })

        it('try add new blog with wrong data and get 400', async () => {
            const {blog} = expect.getState()

            const postsInputData = {
                title: 55,
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: blog.id,
                blogName: 'finance'
            }
            // @ts-ignore
            let response = await addNewPost(postsInputData);
            expect(response.status).toBe(400)
        })


    })

    describe('Posts router PUT method', () => {
        it('should delete all blogs', async () => {
            await request(app).delete('/testing/all-data');
            await request(app)
                .get('/posts')
                .expect(200, [])
        })
        it('should return 201 status and add new blog', async () => {
            const blogInputData = {
                name: "Pavel Durov",
                websiteUrl: "https://vk.com",
                description: "it businessman"
            }

            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
                // createdAt: expect.any(String),
                // isMembership: false
            })
            expect.setState({blog: newBlog})
        })
        it('should return 201 status and add new post', async () => {
            const {blog} = expect.getState()

            const postsInputData = {
                title: 'Money',
                shortDescription: 'How to make money?',
                content: 'Just born in Billionare family',
                blogId: blog.id,
            }

            let response = await addNewPost(postsInputData);
            expect(response.status).toBe(201)
            const newPost = response.body
            expect(newPost).toEqual({
                id: expect.any(String),
                title: postsInputData.title,
                shortDescription: postsInputData.shortDescription,
                content: postsInputData.content,
                blogId: postsInputData.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
            })
            expect.setState({post: newPost})
        })

        it('should return 204 status and  change post', async () => {
            const {blog} = expect.getState()
            const {post} = expect.getState()
            const resp = await request(app)
                .put('/posts/' + post.id)
                .send(
                    {
                        title: 'Women',
                        shortDescription: 'How to sleep with 1000 women?',
                        content: 'Just born in Billionare family',
                        blogId: blog.id,
                    })
                .auth('admin', 'qwerty')

            expect(resp.status).toBe(204)


            let getUpdatePost = await postRepository.findPostById(post.id)
            console.log(getUpdatePost + '  input data here!!')
            await request(app)
                .get('/posts')
                .expect(200, [getUpdatePost])

            expect.setState({post: getUpdatePost})

        })
        it('try change post unauthorized and return 401', async () => {
            const {post} = expect.getState()
            const resp = await request(app)
                .put('/posts/' + post.id)
                .send(
                    {
                        title: 'Sport',
                        shortDescription: 'How to be Fit?',
                        content: 'Just go to fu**cking gym and eat healthy men',
                        blogId: '2',
                        blogName: 'sport'
                    })
            expect(resp.status).toBe(401)

        })
        it('should return 400 status and try change post by wrong data', async () => {
            const {post} = expect.getState()
            const resp = await request(app)
                .put('/posts/' + post.id)
                .send(
                    {
                        title: 'Sport',
                        shortDescription: 7777,
                        content: 'Just go to fu**cking gym and eat healthy men',
                        blogId: '2',
                        blogName: 'sport'
                    })
                .auth('admin', 'qwerty')

            expect(resp.status).toBe(400)

        })
        it('try change  non-exist blog and return 404', async () => {
            let randomNumber = 561649849;
            const resp = await request(app)
                .put('/posts/' + randomNumber)
                .send(
                    {
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