import e, {Request, Response, Router} from 'express';
import {blogValidation} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {blogService} from '../domain/blog-service';
import {blogRepository} from '../repositories/blog/blog-repository';
import {postValidation} from '../validation/posts-validation-middleware';
import {blogQueryRepository} from '../repositories/blog/blog-query-repository';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {queryValidation} from '../validation/query-validation';
import {postService} from '../domain/post-service';
import {BlogInputModel, BlogViewType, PaginatorBlogViewType} from '../types/blog-types';
import {PaginatorPostViewType, postInputDataModelForExistingBlog, PostViewModel} from '../types/post-types';

export const blogsRouter = Router({})

blogsRouter.get('/',
    queryValidation,
    async (req: Request, res: Response): Promise<e.Response | PaginatorBlogViewType> => {
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const allBlogs: PaginatorBlogViewType = await blogQueryRepository.getAllBlogs(queryData);
            return res.send(allBlogs)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })

blogsRouter.get('/:id', async (req: Request, res: Response): Promise<e.Response | BlogViewType> => {
    let foundBlog: BlogViewType = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
        return res.send(foundBlog)
    }
    return res.sendStatus(404)
})

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response): Promise<e.Response> => {
        const isDeleted: boolean = await blogService.deleteBlog(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else return res.sendStatus(404)
    })

blogsRouter.post('/',
    basicAuthMiddleware,
    blogValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response | BlogViewType> => {

        try {
            let BlogInputData: BlogInputModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            }
            const newBlog: BlogViewType = await blogService.createBlog(BlogInputData);

            return res.status(201).send(newBlog)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    blogValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response | boolean> => {

        try {
            let BlogUpdateData: BlogInputModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            }
            const isBlogUpdate: boolean = await blogService.updateBlog(req.params.id, BlogUpdateData);
            if (isBlogUpdate) {
                return res.sendStatus(204)
            } else {
                return res.sendStatus(404)
            }
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })


blogsRouter.get('/:id/posts',
    queryValidation,
    async (req: Request, res: Response): Promise<e.Response | PaginatorPostViewType> => {
        let isExistBlog = await blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            return res.sendStatus(404)
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            let foundPosts: PaginatorPostViewType = await blogQueryRepository.getAllPostOfBlog(req.params.id, queryData);

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
    async (req: Request, res: Response): Promise<e.Response | PostViewModel> => {
        let isExistBlog = await blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            return res.sendStatus(404)
        }
        try {
            let postInputData: postInputDataModelForExistingBlog = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
            }
            const newPost: PostViewModel | boolean = await postService.createPostForExistingBlog(req.params.id, postInputData);

            return res.status(201).send(newPost)
        } catch (e) {
            return res.status(500).json(e)
        }

    })