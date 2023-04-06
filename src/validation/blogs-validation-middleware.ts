import {body, validationResult} from 'express-validator';
import {NextFunction, Response, Request} from 'express';

export const nameBlogMiddleware = body('name').isString().trim().isLength({
    min: 1,
    max: 15
}).withMessage('name should be less than 15 symbols string');
export const descriptionBlogMiddleware = body('description').isString().trim().isLength({
    min: 1,
    max: 500
}).withMessage('description should be less than 500 symbols string');

export const websiteUrlBlogMiddleware = body('websiteUrl').isString().isLength({max: 100}).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('websiteUrl should be less than 100 sympols string');

export const blogValidation = [nameBlogMiddleware, descriptionBlogMiddleware ,websiteUrlBlogMiddleware]
