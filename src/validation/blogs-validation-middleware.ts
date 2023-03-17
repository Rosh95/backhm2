import {body, validationResult} from 'express-validator';
import {NextFunction, Response, Request} from 'express';

export const nameBlogMiddleware = body('name').isString().trim().isLength({
    min: 1,
    max: 15
}).withMessage('name should be less than 15 sympols string');
export const descriptionBlogMiddleware = body('description').isString().trim().isLength({
    min: 1,
    max: 500
}).withMessage('description should be less than 500 sympols string');

export const websiteUrlBlogMiddleware = body('websiteUrl').isString().isLength({max: 100}).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('websiteUrl should be less than 100 sympols string');


export const errorsBlogMiddleware = (req: Request, res: Response, next: NextFunction) => {
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