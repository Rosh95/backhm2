import {Request, Response, Router} from 'express';
import {blogRepository} from '../repositories/blog-repository';
import {blogType} from '../db/db';
import {
    descriptionBlogMiddleware, errorsBlogMiddleware,
    nameBlogMiddleware,
    websiteUrlBlogMiddleware
} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';

export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs: Array<blogType> = blogRepository.findBlogs();
    res.send(blogs)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    let foundBlog: blogType | undefined = blogRepository.findBlogById(+req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
        return;
    }
    res.sendStatus(404)
})

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    (req: Request, res: Response) => {

        const isDeleted = blogRepository.deleteBlog(+req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
        }
        else res.sendStatus(404)
    })

blogsRouter.post('/',
    basicAuthMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    websiteUrlBlogMiddleware,
    errorsBlogMiddleware,
    (req: Request, res: Response) => {

        const newBlog = blogRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        res.status(201).send(newBlog)

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    websiteUrlBlogMiddleware,
    errorsBlogMiddleware,
    (req: Request, res: Response) => {

        let foundBlog = blogRepository.updateBlog(+req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
        if (foundBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
