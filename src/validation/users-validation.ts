import {body} from 'express-validator';

export const loginUserMiddleware = body('login').isString().trim().isLength({
    min: 3,
    max: 10
}).matches('^[a-zA-Z0-9_-]*$').withMessage('login should be between 3 and 10 symbols string');
export const passwordUserMiddleware = body('password').isString().trim().isLength({
    min: 6,
    max: 20
}).withMessage('password should be between 6 and 20 symbols string');

export const emailUserMiddleware = body('email').isString().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email should be correct:)');

export const userValidation = [loginUserMiddleware, passwordUserMiddleware, emailUserMiddleware]
