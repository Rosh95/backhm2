import e, {Request, Response, Router} from 'express';
import {postValidation} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {PostQueryRepository, postQueryRepository} from '../repositories/post/post-query-repository';
import {PostService, postService} from '../domain/post-service';
import {queryValidation} from '../validation/query-validation';
import {authValidationCommentMiddleware, authValidationINfoMiddleware} from '../validation/auth-validation-middleware';
import {CommentContentPostMiddleware, LikeStatusPutMiddleware} from '../validation/comments-validation-middleware';
import {commentsService} from '../domain/comments-service';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {BlogViewType} from '../types/blog-types';
import {PaginatorPostViewType, postInputDataModel, postInputUpdatedDataModel, PostViewModel} from '../types/post-types';
import {CommentsInputData, PaginatorCommentViewType} from '../types/comments-types';
import {BlogQueryRepository, blogQueryRepository} from "../repositories/blog/blog-query-repository";
import {ResultObject} from "../domain/device-service";
import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {postRepository, PostRepository} from "../repositories/post/post-repository";

export const postsRouter = Router({})

export class PostController {

    constructor(public postRepository: PostRepository,
                public postQueryRepository: PostQueryRepository,
                public blogQueryRepository: BlogQueryRepository,
                public postService: PostService) {
    }

    async getPosts(req: Request, res: Response): Promise<e.Response<PaginatorPostViewType>> {
        let userId = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByAccessToken(token.toString());
        }

        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const allPosts: PaginatorPostViewType = await this.postQueryRepository.getAllPosts(queryData, userId);
            return res.send(allPosts)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async getPostById(req: Request, res: Response): Promise<e.Response<PostViewModel>> {
        let userId = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByAccessToken(token.toString());
        }
        try {
            let foundPost: PostViewModel | null = await this.postQueryRepository.findPostById(req.params.id, userId)
            if (foundPost) {
                return res.send(foundPost)
            }
            return res.sendStatus(404)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async deletePostById(req: Request, res: Response) {
        const isDeleted: boolean = await this.postService.deletePost(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        } else return res.sendStatus(404)
    }

    async createPost(req: Request, res: Response) {
        let foundBlog: BlogViewType | null = await this.blogQueryRepository.findBlogById(req.body.blogId)
        if (!foundBlog) {
            return res.sendStatus(404);
        }
        try {
            let postInputData: postInputDataModel = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
            }
            const newPost: ResultObject<string> = await this.postService.createPost(postInputData, foundBlog);
            const gotNewPost: PostViewModel | null = newPost.data ? await this.postQueryRepository.findPostById(newPost.data) : null;
            return res.status(201).send(gotNewPost)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }

    }

    async updatePost(req: Request, res: Response) {
        try {
            let updatedPostData: postInputUpdatedDataModel = {
                content: req.body.content,
                title: req.body.title,
                shortDescription: req.body.shortDescription
            }
            let isPostUpdated: boolean = await this.postService.updatePost(req.params.id, updatedPostData);
            if (isPostUpdated) {
                return res.sendStatus(204)
            } else {
                return res.sendStatus(404)
            }
        } catch (e) {
            return res.sendStatus(500)
        }
    }

    async createCommentForPostById(req: Request, res: Response) {
        const currentPost: PostViewModel | null = await this.postQueryRepository.findPostById(req.params.postId);
        if (!currentPost) {
            return res.sendStatus(404)
        }

        try {
            if (!req.user) {
                throw new Error('user doesn`t exist');
            }
            const newCommentData: CommentsInputData = {
                content: req.body.content,
                userId: req.user._id,
                userLogin: req.user.accountData.login,
                postId: req.params.postId
            }

            const newCommentObjectId: ObjectId = await commentsService.createCommentForPost(newCommentData);
            const newComment = await commentQueryRepository.getCommentById(newCommentObjectId.toString(), req.user._id)
            return res.status(201).send(newComment);
        } catch (e) {
            return res.sendStatus(500)
        }
    }

    async getCommentForPostById(req: Request, res: Response): Promise<e.Response | PaginatorCommentViewType> {
        let userId = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByAccessToken(token.toString());
        }

        const currentPost = await this.postQueryRepository.findPostById(req.params.postId);
        if (!currentPost) {
            return res.sendStatus(404)
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const comments: PaginatorCommentViewType = await commentQueryRepository.getAllCommentsOfPost(req.params.postId, queryData, userId)
            return res.send(comments);
        } catch (e) {
            return res.status(500).json(e)
        }
    }

    async updatePostLikeStatus(req: Request, res: Response) {
        let currentUser = req.user;

        try {
            const postInfo = await this.postRepository.getPostById(req.params.postId);
            if (!postInfo) {
                return res.send(404);
            }
            const updatedPostStatus = await this.postService.updatePostLikeStatusById(postInfo, req.body.likeStatus, currentUser!);
            return res.send(204);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

}


export const postController = new PostController(postRepository, postQueryRepository, blogQueryRepository,
    postService);


postsRouter.get('/', queryValidation, postController.getPosts.bind(postController))

postsRouter.get('/:id', postController.getPostById.bind(postController))

postsRouter.delete('/:id', basicAuthMiddleware, postController.deletePostById.bind(postController))

postsRouter.post('/', basicAuthMiddleware, postValidation, errorsValidationMiddleware, postController.createPost.bind(postController))

postsRouter.put('/:id', basicAuthMiddleware, postValidation, errorsValidationMiddleware, postController.updatePost.bind(postController))

postsRouter.post('/:postId/comments', authValidationCommentMiddleware,
    CommentContentPostMiddleware,
    errorsValidationMiddleware, postController.createCommentForPostById.bind(postController))

postsRouter.get('/:postId/comments', postController.getCommentForPostById.bind(postController))
postsRouter.put('/:postId/like-status',
    authValidationINfoMiddleware,
    LikeStatusPutMiddleware,
    errorsValidationMiddleware, postController.updatePostLikeStatus.bind(postController))
