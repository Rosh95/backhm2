import {body, validationResult} from 'express-validator';
import {NextFunction, Response, Request} from 'express';
import {db} from '../db/db';

export const titlePostMiddleware = body('title').isString().trim().custom(value => value !== '').isLength({
    max: 30
}).withMessage('title should be less than 30 symbols string');
export const shortDescriptionPostMiddleware = body('shortDescription').isString().isLength({max: 100}).withMessage('shortDescription should be less than 500 sympols string');

export const contentPostMiddleware = body('content').isString().isLength({max: 1000}).withMessage('content should be less than 1000 sympols string');

const blogsIdArray = db.blogs.map(b => b.id);
console.log(blogsIdArray)
export const blogIdMiddleware = body('blogId').isString().custom((value) => {
    const isIncluded = blogsIdArray.includes(value);
    if (!isIncluded) {
        throw new Error('This blodId doesn`t exist')
    }
    return true;

}).withMessage('Please, write exist blogId');

export const errorsPostMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array().map((e) => {
                    return {
                        message: e.msg,
                        field: e.param
                    }
                }
            )
        })
    } else {
        next()
    }
}