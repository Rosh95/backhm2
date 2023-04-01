import {Request, Response, Router} from 'express';
import {blogRepository} from '../repositories/blog-repository';
import {blogType} from '../db/db';
import {
    descriptionBlogMiddleware, errorsBlogMiddleware,
    nameBlogMiddleware,
    websiteUrlBlogMiddleware
} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {Collection} from 'mongodb';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogRepository.findBlogs();
    res.send(blogs)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundBlog = await blogRepository.findBlogById(req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
        return;
    }
    res.sendStatus(404)
})

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await blogRepository.deleteBlog(req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

blogsRouter.post('/',
    basicAuthMiddleware,
    websiteUrlBlogMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    errorsBlogMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        res.status(201).send(newBlog)

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    websiteUrlBlogMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    errorsBlogMiddleware,
    async (req: Request, res: Response) => {

        let foundBlog = await blogRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
        if (foundBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
