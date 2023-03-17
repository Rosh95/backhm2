"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsBlogMiddleware = exports.websiteUrlBlogMiddleware = exports.descriptionBlogMiddleware = exports.nameBlogMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.nameBlogMiddleware = (0, express_validator_1.body)('name').isString().trim().custom(value => value !== '').isLength({
    max: 15
}).withMessage('name should be less than 15 sympols string');
exports.descriptionBlogMiddleware = (0, express_validator_1.body)('description').isString().trim().isLength({
    min: 1,
    max: 500
}).withMessage('description should be less than 500 sympols string');
exports.websiteUrlBlogMiddleware = (0, express_validator_1.body)('websiteUrl').isString().isLength({ max: 100 }).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('websiteUrl should be less than 100 sympols string');
const errorsBlogMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array().map((e) => {
                return {
                    message: e.msg,
                    field: e.param
                };
            })
        });
    }
    else {
        next();
    }
};
exports.errorsBlogMiddleware = errorsBlogMiddleware;
