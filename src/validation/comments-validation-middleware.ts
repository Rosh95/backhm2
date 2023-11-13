import {body} from 'express-validator';

export const CommentContentPostMiddleware = body('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('content should be between 20 and 300 symbols');

// export const CommentLikeStatusPutMiddleware = body('likeStatus').trim().custom((value) => {
//     if (value !== "None" || value !== LikeStatusOption.Like || value !== LikeStatusOption.Dislike) {
//         return false
//     }
//     return true
// }).withMessage('LikeStatus Should be one of this values: Like, Dislike or None');
export const LikeStatusPutMiddleware = body('likeStatus')
    .trim().isIn(["None", "Like", "Dislike"]).withMessage('LikeStatus Should be one of this values: Like, Dislike or None');