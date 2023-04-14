import {Request, Response, Router} from 'express';
import {commentsService} from '../domain/comments-service';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {blogService} from '../domain/blog-service';
import {CommentContentPostMiddleware} from '../validation/comments-validation-middleware';


export const commentsRouter = Router({});

// commentsRouter.post('/',
//     authValidationMiddleware,
//     async (req, res) => {
//         const newComment = await commentsService.sendComment(req.body.comment, req.user!._id)
//         res.status(201).send(newComment)
//     }
// )
commentsRouter.get('/',
    async (req, res) => {
        const comments = await commentQueryRepository.getAllComments()
        res.send(comments);
    }
)
commentsRouter.get('/:commentId',
    async (req, res) => {
        const commentInfo = await commentsService.getCommentById(req.params.commentId);
        if (!commentInfo) {
            res.send(404);
        }
        res.send(commentInfo);

    }
)
commentsRouter.delete('/:commentId',
    async (req: Request, res: Response) => {
        const commentInfo = await commentsService.getCommentById(req.params.commentId);
        if (!commentInfo) {
            res.send(404);
        }
        const isDeleted = await commentsService.deleteCommentById(req.params.commentId)

        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }
)

commentsRouter.put('/:commentId',
    CommentContentPostMiddleware,
    async (req, res) => {

        const commentInfo = await commentsService.getCommentById(req.params!.commentId);
        if (!commentInfo) {
            res.send(404);
        }

        const updatedComment = await commentsService.updateCommentById(req.params!.commentId, req.body.content);
        if (!updatedComment) {
            res.send(404);
        }
        res.send(204);

    }
)