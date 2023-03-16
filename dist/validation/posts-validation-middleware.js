"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsPostMiddleware = exports.blogIdMiddleware = exports.contentPostMiddleware = exports.shortDescriptionPostMiddleware = exports.titlePostMiddleware = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
exports.titlePostMiddleware = (0, express_validator_1.body)('title').isString().trim().isLength({ max: 30 }).withMessage('title should be less than 30 symbols string');
exports.shortDescriptionPostMiddleware = (0, express_validator_1.body)('shortDescription').isString().isLength({ max: 100 }).withMessage('shortDescription should be less than 500 sympols string');
exports.contentPostMiddleware = (0, express_validator_1.body)('content').isString().isLength({ max: 1000 }).withMessage('content should be less than 1000 sympols string');
const blogsIdArray = db_1.db.blogs.map(b => b.id);
exports.blogIdMiddleware = (0, express_validator_1.body)('blogId').isString().isIn(blogsIdArray);
const errorsPostMiddleware = (req, res, next) => {
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
exports.errorsPostMiddleware = errorsPostMiddleware;
