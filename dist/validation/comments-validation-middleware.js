"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentContentPostMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.CommentContentPostMiddleware = (0, express_validator_1.body)('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('content should be between 20 and 300 symbols');
