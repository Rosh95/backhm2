import {Request, Response, Router} from 'express';
import {CommentsService, commentsService} from '../domain/comments-service';
import {authValidationCommentMiddleware, authValidationINfoMiddleware} from '../validation/auth-validation-middleware';
import {CommentQueryRepository, commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {
    CommentContentPostMiddleware,
    CommentLikeStatusPutMiddleware
} from '../validation/comments-validation-middleware';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {CommentsViewModel} from '../types/comments-types';
import {CommentRepository, commentRepository} from "../repositories/comment/comment-repository";
import {jwtService} from "../application/jwt-service";


export const commentsRouter = Router({});

export class CommentsController {
    constructor(
        public commentsService: CommentsService,
        public commentRepository: CommentRepository,
        public commentQueryRepository: CommentQueryRepository) {
    }

    async getCommentById(req: Request, res: Response) {
        let userId = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByAccessToken(token.toString());
        }
        const commentInfo: CommentsViewModel | null = await this.commentQueryRepository.getCommentById(req.params.commentId, userId);
        if (!commentInfo) {
            return res.send(404);
        }
        return res.send(commentInfo);
    }

    async deleteCommentById(req: Request, res: Response) {
        try {
            const commentInfo = await this.commentQueryRepository.getCommentById(req.params.commentId);
            if (!commentInfo) {
                return res.send(404);
            }
            const isDeleted = await this.commentsService.deleteCommentById(req.params.commentId)

            if (isDeleted) {
                return res.sendStatus(204)
            } else return res.sendStatus(404)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const commentInfo = await this.commentQueryRepository.getCommentById(req.params.commentId);
            if (!commentInfo) {
                return res.send(404);
            }
            const updatedComment = await this.commentsService.updateCommentById(req.params!.commentId, req.body.content);
            if (!updatedComment) {
                return res.send(404);
            }
            return res.send(204);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async updateCommentLikeStatus(req: Request, res: Response) {
        let currentUser = req.user;

        try {
            const commentInfo = await this.commentRepository.getCommentById(req.params.commentId);
            if (!commentInfo) {
                return res.send(404);
            }
            const updatedCommentStatus = await this.commentsService.updateCommentLikeStatusById(commentInfo, req.body.likeStatus, currentUser!);
            return res.send(204);
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
}

export const commentsController = new CommentsController(commentsService,
    commentRepository,
    commentQueryRepository);

commentsRouter.get('/:commentId', commentsController.getCommentById.bind(commentsController))
commentsRouter.delete('/:commentId', authValidationCommentMiddleware, commentsController.deleteCommentById.bind(commentsController))

commentsRouter.put('/:commentId',
    authValidationCommentMiddleware,
    CommentContentPostMiddleware,
    errorsValidationMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.put('/:commentId/like-status',
    authValidationINfoMiddleware,
    CommentLikeStatusPutMiddleware,
    errorsValidationMiddleware, commentsController.updateCommentLikeStatus.bind(commentsController))
