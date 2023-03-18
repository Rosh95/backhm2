"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsPostMiddleware = exports.blogIdMiddleware = exports.contentPostMiddleware = exports.shortDescriptionPostMiddleware = exports.titlePostMiddleware = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
exports.titlePostMiddleware = (0, express_validator_1.body)('title').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('title should be less than 30 symbols string');
exports.shortDescriptionPostMiddleware = (0, express_validator_1.body)('shortDescription').isString().trim().isLength({
    min: 1,
    max: 100
}).withMessage('shortDescription should be less than 500 symbols string');
exports.contentPostMiddleware = (0, express_validator_1.body)('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage('content should be less than 1000 symbols string');
let blogsIdArray = db_1.db.blogs.map(b => b.id);
console.log(blogsIdArray);
exports.blogIdMiddleware = (0, express_validator_1.body)('blogId').isString().custom((value) => {
    console.log(value);
    console.log(`${blogsIdArray} exists blogID`);
    const isIncluded = db_1.db.blogs.map(b => b.id).includes(value);
    if (!isIncluded) {
        return false;
        // throw new Error('This blogId doesn`t exist')
    }
    return true;
}).withMessage('Please, write exist blogId');
const errorsPostMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array({ onlyFirstError: true }).map((e) => {
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
