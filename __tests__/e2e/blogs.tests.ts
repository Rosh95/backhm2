import request from 'supertest'
import {blogInputType, db} from '../../src/db/db';
import {app} from '../../src/app';

export const addNewBlog = async (blog: blogInputType) => {
    let response = await request(app)
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send(blog)

    return response;
}
describe('Blogs router', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    describe('Blogs router GET method', () => {
        it('should return 200 and empty array blogs', async () => {
            await request(app)
                .get('/blogs')
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
                _id: expect.any(String),
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                 createdAt: expect.any(String),
                 isMembership: expect.any(Boolean)
            })
            expect.setState({blog: newBlog})
        })
        it('should get blog by id', async () => {
            const {blog} = expect.getState()

            const getBlogResponse = await request(app).get(`/blogs/${blog.id}`)
            expect(getBlogResponse.status).toBe(200)
            const blogFromAPi = getBlogResponse.body
            expect(blogFromAPi).toEqual(blog)
        })
        it('should get non-existent blog and return 404', async () => {
            let randomNumber = 1222555;
            const getBlogResponse = await request(app).get(`/blogs/${randomNumber}`)
            expect(getBlogResponse.status).toBe(404)
        })

    })

    describe('Blogs router DELETE method', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })
        it('should delete unexciting blog by id and return 404', async () => {
            let randomNumber = 55555;
            await request(app)
                .delete(`/blogs/${randomNumber}`)
                .auth('admin', 'qwerty')
                .expect(404)
        })
        it('should delete  blog by id unauthorized and return 401 ', async () => {
            let randomNumber = 55555;
            await request(app)
                .delete(`/blogs/${randomNumber}`)
                .expect(401)
        })
        it('should return 201 status and add new blog', async () => {
            const blogInputData = {
                name: "Vasya Pupkin",
                websiteUrl: "https://vk.com/55",
                description: "homeless"
            }
            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                _id: expect.any(String),
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
            expect.setState({blog: newBlog})
        })
        it('should delete blog by id', async () => {
            const {blog} = expect.getState()

            await request(app)
                .delete('/blogs/' + blog.id)
                .auth('admin', 'qwerty')
                .expect(204)

            await request(app)
                .get('/blogs')
                .expect(200, [])
        })
    })

    describe('Blogs router POST method', () => {
        // beforeAll(async () => {
        //     await request(app).delete('/testing/all-data')
        // })
        it('try add post by unauthorized user and return 401', async () => {
            const blogInputData = {
                name: "Vasyliy Pupkin",
                websiteUrl: "https://vk.com/55",
                description: "teacher"
            }
            let response = await request(app)
                .post('/blogs')
                .send(blogInputData);
            expect(response.status).toBe(401)
        })
        it('should return 201 status and add new blog', async () => {
            const blogInputData = {
                name: "Vasyliy Pupkin",
                websiteUrl: "https://vk.com/55",
                description: "teacher"
            }
            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                _id: expect.any(String),
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
            expect.setState({blog: newBlog})
        })
        it('try add new blog with wrong data and get 400', async () => {
            const blogInputData = {
                name: "Vasyliy Pupkin",
                websiteUrl: "httppppps://vk.com/55",
                description: "teacher"
            }
            let response = await addNewBlog(blogInputData);
            expect(response.status).toBe(400)
        })


    })

    describe('Blogs router PUT method', () => {
        it('should delete all blogs', async () => {
            await request(app).delete('/testing/all-data');
            await request(app)
                .get('/blogs')
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
                _id: expect.any(String),
                id: expect.any(String),
                name: blogInputData.name,
                description: blogInputData.description,
                websiteUrl: blogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
            expect.setState({blog: newBlog})
        })
        it('should return 204 status and  change blog', async () => {
            const {blog} = expect.getState()
            const resp = await request(app)
                .put('/blogs/' + blog.id)
                .send(
                    {
                        name: "Nikolay Durov",
                        websiteUrl: "https://vk.com",
                        description: "it programming man"
                    })
                .auth('admin', 'qwerty')

            expect(resp.status).toBe(204)
            const updateBlogInputData = {
                id: blog.id,
                name: "Nikolay Durov",
                websiteUrl: "https://vk.com",
                description: "it programming man"
            }

            await request(app)
                .get('/blogs')
                .expect(200, [updateBlogInputData])

            expect.setState({blog: updateBlogInputData})

        })
        it('try change blog unauthorized and return 401', async () => {
            const {blog} = expect.getState()
            const resp = await request(app)
                .put('/blogs/' + blog.id)
                .send(
                    {
                        name: "Nikolay Durov",
                        websiteUrl: "https://vk.com",
                        description: "it programming man"
                    })
            expect(resp.status).toBe(401)

        })
        it('should return 400 status and try change blog by wrong data', async () => {
            const {blog} = expect.getState()
            const resp = await request(app)
                .put('/blogs/' + blog.id)
                .send(
                    {
                        name: "Nikolay Durov",
                        websiteUrl: "httjkdfngaps://vk.com",
                        description: "it programming man"
                    })
                .auth('admin', 'qwerty')

            expect(resp.status).toBe(400)
            // const updateBlogInputData = {
            //     id: blog.id,
            //     name: "Nikolay Durov",
            //     websiteUrl: "https://vk.com",
            //     description: "it programming man"
            // }
            //
            // await request(app)
            //     .get('/blogs')
            //     .expect(200, [updateBlogInputData])
            //
            // expect.setState({blog: updateBlogInputData})

        })
        it('try change  non-exist blog and return 404', async () => {
            const {blog} = expect.getState()
            let randomNumber = 561649849;
            const resp = await request(app)
                .put('/blogs/' + randomNumber)
                .send(
                    {
                        name: "Nikolay Durov",
                        websiteUrl: "https://vk.com",
                        description: "it programming man"
                    })
                .auth('admin', 'qwerty')
            expect(resp.status).toBe(404)

        })

    })

})