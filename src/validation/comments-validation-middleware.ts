import {body} from 'express-validator';
import {LikeStatusOption} from "../types/comments-types";

export const CommentContentPostMiddleware = body('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('content should be between 20 and 300 symbols');

export const CommentLikeStatusPutMiddleware = body('likeStatus').trim().custom((value) => {
    return !(value !== LikeStatusOption.None || value !== LikeStatusOption.Like || value !== LikeStatusOption.Dislike);
}).withMessage('LikeStatus Should be one of this values: Like, Dislike or None');