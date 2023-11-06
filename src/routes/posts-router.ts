import e, {Request, Response, Router} from 'express';
import {postValidation} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {postQueryRepository} from '../repositories/post/post-query-repository';
import {postService} from '../domain/post-service';
import {queryValidation} from '../validation/query-validation';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {CommentContentPostMiddleware} from '../validation/comments-validation-middleware';
import {commentsService} from '../domain/comments-service';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {BlogViewType} from '../types/blog-types';
import {PaginatorPostViewType, postInputDataModel, postInputUpdatedDataModel, PostViewModel} from '../types/post-types';
import {CommentsInputData, CommentsViewModel, PaginatorCommentViewType} from '../types/comments-types';
import {blogQueryRepository} from "../repositories/blog/blog-query-repository";
import {ResultObject} from "../domain/device-service";
import {ObjectId} from "mongodb";

export const postsRouter = Router({})

postsRouter.get('/',
    queryValidation,
    async (req: Request, res: Response): Promise<e.Response<PaginatorPostViewType>> => {
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const allPosts: PaginatorPostViewType = await postQueryRepository.getAllPosts(queryData);
            return res.send(allPosts)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })

postsRouter.get('/:id', async (req: Request, res: Response): Promise<e.Response<PostViewModel>> => {
    try {
        let foundPost: PostViewModel | null = await postQueryRepository.findPostById(req.params.id)
        if (foundPost) {
            return res.send(foundPost)
        }
        return res.sendStatus(404)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await postService.deletePost(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        } else return res.sendStatus(404)
    })

postsRouter.post('/',
    basicAuthMiddleware,
    postValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let foundBlog: BlogViewType | null = await blogQueryRepository.findBlogById(req.body.blogId)
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
            const newPost: ResultObject<string> = await postService.createPost(postInputData, foundBlog);
            const gotNewPost: PostViewModel | null = newPost.data ? await postQueryRepository.findPostById(newPost.data) : null;
            return res.status(201).send(gotNewPost)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    postValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            let updatedPostData: postInputUpdatedDataModel = {
                content: req.body.content,
                title: req.body.title,
                shortDescription: req.body.shortDescription
            }
            let isPostUpdated: boolean = await postService.updatePost(req.params.id, updatedPostData);
            if (isPostUpdated) {
                return res.sendStatus(204)
            } else {
                return res.sendStatus(404)
            }
        } catch (e) {
            return res.sendStatus(500)
        }
    }
)

postsRouter.post('/:postId/comments',
    authValidationMiddleware,
    CommentContentPostMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        const currentPost: PostViewModel | null = await postQueryRepository.findPostById(req.params.postId);
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
            const newComment = await commentQueryRepository.getCommentById(newCommentObjectId.toString())
            return res.status(201).send(newComment);
        } catch (e) {
            return res.sendStatus(500)
        }
    }
)

postsRouter.get('/:postId/comments',
    async (req: Request, res: Response): Promise<e.Response | PaginatorCommentViewType> => {
        const currentPost = await postQueryRepository.findPostById(req.params.postId);
        if (!currentPost) {
            return res.sendStatus(404)
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const comments: PaginatorCommentViewType = await commentQueryRepository.getAllCommentsOfPost(req.params.postId, queryData)
            return res.send(comments);
        } catch (e) {
            return res.status(500).json(e)
        }
    }
)
