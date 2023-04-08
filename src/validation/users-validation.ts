import {body} from 'express-validator';

export const nameUserMiddleware = body('login').isString().trim().isLength({
    min: 3,
    max: 10
}).matches('^[a-zA-Z0-9_-]*$').withMessage('name should be less than 15 symbols string');
export const passwordUserMiddleware = body('password').isString().trim().isLength({
    min: 6,
    max: 20
}).withMessage('description should be less than 500 symbols string');

export const emailUserMiddleware = body('email').isString().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$\n').withMessage('websiteUrl should be less than 100 sympols string');

export const userValidation = [nameUserMiddleware, passwordUserMiddleware, emailUserMiddleware]
