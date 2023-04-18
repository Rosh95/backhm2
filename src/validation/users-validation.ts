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

export const emailUserMiddleware = body('email').isString().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email should be correct:)');

export const checkExistUserMiddleware = body('login').isString().custom(async (value) => {

    let foundUser = await userService.findUserByLogin(value);

    if (foundUser) {
        throw new Error('This login already exist. Please, choose another one.')
    }
    return true;
})
export const userValidation = [loginUserMiddleware, passwordUserMiddleware, emailUserMiddleware, checkExistUserMiddleware]
