import e, {Request, Response, Router} from 'express';
import {blogValidation} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {blogService} from '../domain/blog-service';
import {blogRepository} from '../repositories/blog-repository';
import {postValidation} from '../validation/posts-validation-middleware';
import {blogQueryRepository} from '../repositories/blog-query-repository';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {queryValidation} from '../validation/query-validation';
import {postService} from '../domain/post-service';

export const blogsRouter = Router({})

blogsRouter.get('/',
    queryValidation,
    async (req: Request, res: Response): Promise<e.Response> => {

        let queryData: queryDataType = await getDataFromQuery(req.query)
        const allBlogs = await blogQueryRepository.getAllBlogs(queryData);
        return res.send(allBlogs)
    })

blogsRouter.get('/:id', async (req: Request, res: Response) => {

    let foundBlog = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
        return res.send(foundBlog)

    }
    return res.sendStatus(404)
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
    blogValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        res.status(201).send(newBlog)

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    blogValidation,
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
    queryValidation,
    async (req: Request, res: Response) => {
        let isExistBlog = await blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            return res.sendStatus(404)
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            let foundPosts = await blogQueryRepository.getAllPostOfBlog(req.params.id, queryData);

            return res.send(foundPosts);

        } catch (e) {
            return res.status(500).json(e)
        }
    })

blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    postValidation,
    queryValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let isExistBlog = await blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            return res.sendStatus(404)
        }
        try {

            const newPost = await postService.createPostForExistingBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content);

            return res.status(201).send(newPost)
        } catch (e) {
            return res.status(500).json(e)
        }

    })