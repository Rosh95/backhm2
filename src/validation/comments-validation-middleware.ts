import {body} from 'express-validator';

export const CommentContentPostMiddleware = body('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('content should be between 20 and 300 symbols');