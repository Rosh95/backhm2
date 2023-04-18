import {Request, Response, Router} from 'express';
import {commentsService} from '../domain/comments-service';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {CommentContentPostMiddleware} from '../validation/comments-validation-middleware';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {CommentsViewModel} from '../types/comments-types';


export const commentsRouter = Router({});


commentsRouter.get('/',
    async (req, res) => {
        const comments: CommentsViewModel[] = await commentQueryRepository.getAllComments()
        return res.send(comments);
    }
)
commentsRouter.get('/:commentId',
    async (req, res) => {
        const commentInfo: CommentsViewModel | null = await commentsService.getCommentById(req.params.commentId);
        if (!commentInfo) {
            return res.send(404);
        }
        return res.send(commentInfo);

    }
)
commentsRouter.delete('/:commentId',
    authValidationMiddleware,

    async (req: Request, res: Response)=> {

        try {
            const commentInfo = await commentsService.getCommentById(req.params.commentId);
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
            const commentInfo = await commentsService.getCommentById(req.params!.commentId);
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