import {Request, Response, Router} from 'express';
import {
    descriptionBlogMiddleware,
    nameBlogMiddleware,
    websiteUrlBlogMiddleware
} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {blogService} from '../domain/blog-service';
import {ObjectId} from 'mongodb';
import {blogRepository} from '../repositories/blog-repository';
import {
    blogIdMiddleware, blogIdMiddlewareInParams,
    contentPostMiddleware,
    shortDescriptionPostMiddleware,
    titlePostMiddleware
} from '../validation/posts-validation-middleware';
import {postRepository} from '../repositories/post-repository';
import {postsRouter} from './posts-router';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    let pageNumber = req.body.pageNumber ? req.body.pageNumber : '1';
    let pageSize = req.body.pageSize ? req.body.pageSize : '10';
    let sortByProp = req.body.sortBy ? req.body.sortBy : 'createdAt';
    let sortDirection = req.body.sortDirection ? req.body.sortDirection : 'desc';

    const blogs = await blogService.findBlogs();
    let postsPagesCount = Math.ceil(+blogs.length / +pageSize);
    let postsTotalCount = +blogs.length;

    const result = {
        pagesCount: postsPagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: postsTotalCount,
        items: blogs

    }
    res.send(result)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundBlog = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
        return;
    }
    res.sendStatus(404)
})

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await blogService.deleteBlog(req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

blogsRouter.post('/',
    basicAuthMiddleware,
    websiteUrlBlogMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        res.status(201).send(newBlog)

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    websiteUrlBlogMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        let foundBlog = await blogService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
        if (foundBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


blogsRouter.get('/:id/posts',
    blogIdMiddlewareInParams,
    async (req: Request, res: Response) => {

        try {
            let pageNumber = req.body.pageNumber ? req.body.pageNumber : '1';
            let pageSize = req.body.pageSize ? req.body.pageSize : '10';
            let sortByProp = req.body.sortBy ? req.body.sortBy : 'createdAt';
            let sortDirection = req.body.sortDirection ? req.body.sortDirection : 'desc';


            let foundBlogs = await blogRepository.getAllPostOfBlog(req.params.id, pageNumber, pageSize, sortByProp, sortDirection);

            let postsPagesCount = Math.ceil(+foundBlogs.length / +pageSize);
            let postsTotalCount = +foundBlogs.length;

            const result = {
                pagesCount: postsPagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: postsTotalCount,
                items: foundBlogs

            }
            if (foundBlogs) {
                res.send(result)
                return;
            }
            res.sendStatus(404)
        } catch (e) {
            res.status(500).json(e)
        }
    })

blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    blogIdMiddlewareInParams,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const newPost = await blogRepository.createPostForExistingBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content);

            res.status(201).send(newPost)
        } catch (e) {
            res.status(500).json(e)
        }

    })