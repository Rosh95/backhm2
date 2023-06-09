"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidation = exports.websiteUrlBlogMiddleware = exports.descriptionBlogMiddleware = exports.nameBlogMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.nameBlogMiddleware = (0, express_validator_1.body)('name').isString().trim().isLength({
    min: 1,
    max: 15
}).withMessage('name should be less than 15 symbols string');
exports.descriptionBlogMiddleware = (0, express_validator_1.body)('description').isString().trim().isLength({
    min: 1,
    max: 500
}).withMessage('description should be less than 500 symbols string');
exports.websiteUrlBlogMiddleware = (0, express_validator_1.body)('websiteUrl').isString().isLength({ max: 100 }).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('websiteUrl should be less than 100 sympols string');
exports.blogValidation = [exports.nameBlogMiddleware, exports.descriptionBlogMiddleware, exports.websiteUrlBlogMiddleware];
