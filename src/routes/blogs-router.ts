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
import {blogQueryRepository} from '../repositories/blog-query-repository';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    let pageNumber = req.body.pageNumber ? req.body.pageNumber : '1';
    let pageSize = req.body.pageSize ? req.body.pageSize : '10';
    // let sortByProp = req.body.sortBy ? req.body.sortBy : 'createdAt';
    // let sortDirection = req.body.sortDirection ? req.body.sortDirection : 'desc';

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
    async (req: Request, res: Response) => {
        let isExistBlog = blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            res.sendStatus(404)
        }

        try {
            let queryData: queryDataType = getDataFromQuery(req)

            let foundBlogs = await blogQueryRepository.getAllPostOfBlog(req.params.id, queryData);

            let postsTotalCount = await blogQueryRepository.getAllPostCount(req.params.id);
            let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);

            const result = {
                pagesCount: postsPagesCount,
                page: queryData.pageNumber,
                pageSize: queryData.pageSize,
                totalCount: postsTotalCount,
                items: foundBlogs

            }
            res.send(result);
            // if (foundBlogs) {
            //     res.send(result)
            //     return;
            // }
            // res.sendStatus(404)
        } catch (e) {
            res.status(500).json(e)
        }
    })

blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let isExistBlog = blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            res.sendStatus(404)
        }
        try {
            const newPost = await blogQueryRepository.createPostForExistingBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content);

            res.status(201).send(newPost)
        } catch (e) {
            res.status(500).json(e)
        }

    })