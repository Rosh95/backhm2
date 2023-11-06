import {Request, Response, Router} from 'express';
import {commentsService} from '../domain/comments-service';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {
    CommentContentPostMiddleware,
    CommentLikeStatusPutMiddleware
} from '../validation/comments-validation-middleware';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {CommentsViewModel} from '../types/comments-types';
import {ObjectId} from "mongodb";
import {commentRepository} from "../repositories/comment/comment-repository";


export const commentsRouter = Router({});


// commentsRouter.get('/',
//     async (req, res) => {
//         const comments: CommentsViewModel[] = await commentQueryRepository.getAllComments()
//         return res.send(comments);
//     }
// )
commentsRouter.get('/:commentId',
    async (req, res) => {
        const commentInfo: CommentsViewModel | null = await commentQueryRepository.getCommentById(req.params.commentId);
        if (!commentInfo) {
            return res.send(404);
        }
        return res.send(commentInfo);

    }
)
commentsRouter.delete('/:commentId',
    authValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const commentInfo = await commentQueryRepository.getCommentById(req.params.commentId);
            if (!commentInfo) {
                return res.send(404);
            }
            const isDeleted = await commentsService.deleteCommentById(req.params.commentId)

            if (isDeleted) {
                return res.sendStatus(204)
            } else return res.sendStatus(404)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
)

commentsRouter.put('/:commentId',
    authValidationMiddleware,
    CommentContentPostMiddleware,
    errorsValidationMiddleware,
    async (req, res) => {
        try {
            const commentInfo = await commentQueryRepository.getCommentById(req.params.commentId);
            if (!commentInfo) {
                return res.send(404);
            }
            const updatedComment = await commentsService.updateCommentById(req.params!.commentId, req.body.content);
            if (!updatedComment) {
                return res.send(404);
            }
            return res.send(204);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
)
commentsRouter.put('/:commentId/like-status',
    authValidationMiddleware,
    CommentLikeStatusPutMiddleware,
    errorsValidationMiddleware,
    async (req, res) => {
    let currentUser = req.user;
        try {
            const commentInfo = await commentRepository.getCommentById(req.params.commentId);
            if (!commentInfo) {
                return res.send(404);
            }
            const updatedCommentStatus = await commentsService.updateCommentLikeStatusById(commentInfo, req.body.likeStatus, currentUser!);
            if (!updatedCommentStatus) {
                return res.send(404);
            }
            return res.send(204);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
)
