import {Router} from 'express';
import {commentsService} from '../domain/comments-service';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';


export const commentsRouter = Router({});

commentsRouter.post('/',
    authValidationMiddleware,
    async (req, res) => {
        const newComment = await commentsService.sendComment(req.body.comment, req.user!._id)
        res.status(201).send(newComment)
    }
)
commentsRouter.get('/',
    async (req, res) => {
        const comments = await commentQueryRepository.getAllComments()
        console.log(comments)
        res.send(comments);
    }
)
commentsRouter.get('/:id',
    async (req, res) => {
        const comment = await commentsService.getCommentById(req.params.id);
        if (comment) {
            res.send(comment)
        }
        res.sendStatus(404)
    }
)