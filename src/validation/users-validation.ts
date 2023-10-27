import {body} from 'express-validator';
import {userService} from '../domain/users-service';

export const loginUserMiddleware = body('login').isString().trim().isLength({
    min: 3,
    max: 10
}).matches('^[a-zA-Z0-9_-]*$').withMessage('login should be between 3 and 10 symbols string');
export const passwordUserMiddleware = body('password').isString().trim().isLength({
    min: 6,
    max: 20
}).withMessage('password should be between 6 and 20 symbols string');

export const emailUserMiddleware = body('email').isEmail().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email should be correct:)');

export const checkExistUserMiddlewareByLogin = body('login').isString().custom(async (value) => {

    let foundUserByLogin = await userService.findUserByLogin(value);

    if (foundUserByLogin) {
        throw new Error('This login  already exist. Please, choose another one.')
    }
    return true;
})
export const checkExistUserMiddlewareByEmail = body('email').isEmail().custom(async (value) => {

    let foundUserByEmail = await userService.findUserByEmail(value);

    if (foundUserByEmail) {
        throw new Error('This  email already exist. Please, choose another one.')
    }
    return true;
})
export const checkRegistredUserByEmail = body('email').isString().custom(async (value) => {
    let foundUserByEmail = await userService.findUserByEmail(value);

    if (foundUserByEmail) {
        return true
    }
    return false;
}).withMessage('we couldn`t found this email')

export const userValidation = [loginUserMiddleware, passwordUserMiddleware, emailUserMiddleware, checkExistUserMiddlewareByLogin, checkExistUserMiddlewareByEmail]
