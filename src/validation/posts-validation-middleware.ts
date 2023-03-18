import {body, validationResult} from 'express-validator';
import {NextFunction, Response, Request} from 'express';
import {db} from '../db/db';

export const titlePostMiddleware = body('title').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('title should be less than 30 symbols string');
export const shortDescriptionPostMiddleware = body('shortDescription').isString().trim().isLength({
    min: 1,
    max: 100
}).withMessage('shortDescription should be less than 500 symbols string');

export const contentPostMiddleware = body('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage('content should be less than 1000 symbols string');

let blogsIdArray = db.blogs.map(b => b.id);
console.log(blogsIdArray)
export const blogIdMiddleware = body('blogId').isString().custom((value) => {
    console.log(value);
    console.log(`${blogsIdArray} exists blogID`)
    const isIncluded = db.blogs.map(b => b.id).includes(value);
    if (!isIncluded) {
        throw new Error('This blodId doesn`t exist')
    }
    return true;

}).withMessage('Please, write exist blogId');

export const errorsPostMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array({onlyFirstError: true}).map((e) => {
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