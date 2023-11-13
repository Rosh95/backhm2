import {Request, Response, Router} from 'express';
import {blogValidation} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {blogService, BlogService} from '../domain/blog-service';
import {postValidation} from '../validation/posts-validation-middleware';
import {blogQueryRepository, BlogQueryRepository} from '../repositories/blog/blog-query-repository';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {queryValidation} from '../validation/query-validation';
import {PostService, postService} from '../domain/post-service';
import {BlogInputModel, BlogViewType, PaginatorBlogViewType} from '../types/blog-types';
import {PaginatorPostViewType, postInputDataModelForExistingBlog, PostViewModel} from '../types/post-types';
import {ResultObject} from "../domain/device-service";
import {PostQueryRepository, postQueryRepository} from "../repositories/post/post-query-repository";
import {jwtService} from "../application/jwt-service";

export const blogsRouter = Router({})

export class BlogsController {
    constructor(public blogService: BlogService,
                public blogQueryRepository: BlogQueryRepository,
                public postService: PostService,
                public postQueryRepository: PostQueryRepository) {
    }

    async getBlogs(req: Request, res: Response) {
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const allBlogs: PaginatorBlogViewType = await this.blogQueryRepository.getAllBlogs(queryData);
            return res.send(allBlogs)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async getBlogById(req: Request, res: Response) {
        let foundBlog: BlogViewType | null = await this.blogQueryRepository.findBlogById(req.params.id)
        if (foundBlog) {
            return res.send(foundBlog)
        }
        return res.sendStatus(404)
    }

    async deleteBlog(req: Request, res: Response) {
        const isDeleted: boolean = await this.blogService.deleteBlog(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else return res.sendStatus(404)
    }

    async createBlog(req: Request, res: Response) {
        try {
            let BlogInputData: BlogInputModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            }
            const newBlog: BlogViewType = await this.blogService.createBlog(BlogInputData);

            return res.status(201).send(newBlog)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }

    }

    async updateBlog(req: Request, res: Response) {
        let isExistBlog = await this.blogQueryRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            res.sendStatus(404)
            return;
        }
        try {
            let BlogUpdateData: BlogInputModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            }
            const isBlogUpdate: boolean = await this.blogService.updateBlog(req.params.id, BlogUpdateData);
            if (isBlogUpdate) {
                return res.sendStatus(204)
            } else {
                return res.sendStatus(404)
            }
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async getPostsFromBlogById(req: Request, res: Response) {
        let isExistBlog = await this.blogQueryRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            res.sendStatus(404)
            return;
        }
        let userId = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByAccessToken(token.toString());
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            let foundPosts: PaginatorPostViewType = await this.blogQueryRepository.getAllPostOfBlog(req.params.id, queryData, userId);
            return res.send(foundPosts);

        } catch (e) {
            return res.status(500).json(e)
        }
    }

    async createPostForBlogById(req: Request, res: Response) {
        let isExistBlog = await this.blogQueryRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            res.sendStatus(404)
            return;
        }
        try {
            let postInputData: postInputDataModelForExistingBlog = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
            }
            const newPost: ResultObject<string> = await this.postService.createPostForExistingBlog(req.params.id, postInputData);
            const gotNewPost: PostViewModel | null = newPost.data ? await this.postQueryRepository.findPostById(newPost.data) : null;
            return res.status(201).send(gotNewPost)
        } catch (e) {
            return res.status(500).json(e)
        }

    }

}


export const blogController = new BlogsController(blogService, blogQueryRepository, postService, postQueryRepository);


blogsRouter.get('/', queryValidation, blogController.getBlogs.bind(blogController))

blogsRouter.get('/:id', blogController.getBlogById.bind(blogController))


blogsRouter.delete('/:id', basicAuthMiddleware, blogController.deleteBlog.bind(blogController))

blogsRouter.post('/', basicAuthMiddleware, blogValidation, errorsValidationMiddleware, blogController.createBlog.bind(blogController))

blogsRouter.put('/:id', basicAuthMiddleware, blogValidation, errorsValidationMiddleware, blogController.updateBlog.bind(blogController))


blogsRouter.get('/:id/posts', queryValidation, blogController.getPostsFromBlogById.bind(blogController))

blogsRouter.post('/:id/posts', basicAuthMiddleware, postValidation,
    queryValidation, errorsValidationMiddleware, blogController.createPostForBlogById.bind(blogController))