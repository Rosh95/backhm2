import {body, validationResult} from 'express-validator';
import {NextFunction, Response, Request} from 'express';

export const titlePostMiddleware = body('title').isString().trim().isLength({max: 30}).withMessage('title should be less than 30 symbols string');
export const shortDescriptionPostMiddleware = body('shortDescription').isString().isLength({max: 100}).withMessage('shortDescription should be less than 500 sympols string');

export const contentPostMiddleware = body('content').isString().isLength({max: 1000}).withMessage('content should be less than 1000 sympols string');
export const blogIdMiddleware = body('blogId').isString();

export const errorsPostMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
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