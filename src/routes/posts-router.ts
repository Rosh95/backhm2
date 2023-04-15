import e, {Request, Response, Router} from 'express';
import {blogIdMiddleware, postValidation} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {postQueryRepository} from '../repositories/post/post-query-repository';
import {postService} from '../domain/post-service';
import {queryValidation} from '../validation/query-validation';
import {blogRepository} from '../repositories/blog/blog-repository';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {CommentContentPostMiddleware} from '../validation/comments-validation-middleware';
import {commentsService} from '../domain/comments-service';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {BlogViewType} from '../types/blog-types';
import {PaginatorPostViewType, postInputDataModel, postInputUpdatedDataModel, PostViewModel} from '../types/post-types';
import {CommentsInputData, CommentsViewModel, PaginatorCommentViewType} from '../types/comments-types';

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
        let foundPost: PostViewModel | null = await postService.findPostById(req.params.id)
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
    async (req: Request, res: Response): Promise<e.Response<boolean>> => {
        const isDeleted: boolean = await postService.deletePost(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        } else return res.sendStatus(404)
    })

postsRouter.post('/',
    basicAuthMiddleware,
    postValidation,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response<PostViewModel>> => {
        let foundBlogName: BlogViewType = await blogRepository.findBlogById(req.body.blogId)
        if (!foundBlogName) {
            return res.sendStatus(404);
        }
        try {
            let postInputData: postInputDataModel = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
            }
            const newPost: PostViewModel = await postService.createPost(postInputData, foundBlogName);
            return res.status(201).send(newPost)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    postValidation,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response | Boolean> => {
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
            console.log(e)
            return res.sendStatus(500)
        }
    }
)

postsRouter.post('/:postId/comments',
    authValidationMiddleware,
    CommentContentPostMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response | CommentsViewModel> => {
        const currentPost: PostViewModel | null = await postService.findPostById(req.params.postId);
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
                userLogin: req.user.login,
                postId: req.params.postId
            }
            const newComment: CommentsViewModel = await commentsService.createCommentForPost(newCommentData);
            console.log(newComment + ' new comment ')

            return res.status(201).send(newComment);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
)

postsRouter.get('/:postId/comments',

    async (req: Request, res: Response): Promise<e.Response | PaginatorCommentViewType> => {
        const currentPost = await postService.findPostById(req.params.postId);
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
