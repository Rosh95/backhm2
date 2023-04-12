import {Request, Response, Router} from 'express';
import {blogIdMiddleware, postValidation} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {commentsMapping, getDataFromQuery, queryDataType} from '../helpers/helpers';
import {postQueryRepository} from '../repositories/post/post-query-repository';
import {postService} from '../domain/post-service';
import {queryValidation} from '../validation/query-validation';
import {blogRepository} from '../repositories/blog/blog-repository';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {CommentContentPostMiddleware} from '../validation/comments-validation-middleware';
import {commentRepository} from '../repositories/comment/comment-repository';
import {commentsService} from '../domain/comments-service';
import {CommentsViewModel} from '../types/comments-types';
import {blogQueryRepository} from '../repositories/blog/blog-query-repository';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';

export const postsRouter = Router({})

postsRouter.get('/',
    queryValidation,
    async (req: Request, res: Response) => {

        let queryData: queryDataType = await getDataFromQuery(req.query)
        const allPosts = await postQueryRepository.getAllPosts(queryData);
        return res.send(allPosts)
    })

postsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundPost = await postService.findPostById(req.params.id)
    if (foundPost) {
        res.send(foundPost)
        return;
    }
    res.sendStatus(404)
})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await postService.deletePost(req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

postsRouter.post('/',
    basicAuthMiddleware,
    postValidation,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let foundBlogName = await blogRepository.findBlogById(req.body.blogId)
        if (!foundBlogName) {
            return res.sendStatus(404);
        }

        const newPost = await postService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, foundBlogName);

        return res.status(201).send(newPost)

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    postValidation,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let updatedPost = await postService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
        if (updatedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

postsRouter.post('/:postId/comments',
    authValidationMiddleware,
    CommentContentPostMiddleware,
    async (req: Request, res: Response) => {
        const currentPost = await postService.findPostById(req.params.postId);
        if (!currentPost) {
            return res.sendStatus(404)
        }

        try {
            if (!req.user) {
                throw new Error('user doesn`t exist');
            }

            const newComment = await commentsService.createCommentForPost(req.user._id, req.user.login, req.params.postId, req.body.content);
            return res.send(newComment);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
)

postsRouter.get('/:postId/comments',
    CommentContentPostMiddleware,
    async (req: Request, res: Response) => {
        const currentPost = await postService.findPostById(req.params.postId);
        if (!currentPost) {
            return res.sendStatus(404)
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            const comments = await commentQueryRepository.getAllCommentsOfPost(req.params.postId, queryData)
            return res.send(comments);
        } catch (e) {
            return res.status(500).json(e)
        }
    }
)
