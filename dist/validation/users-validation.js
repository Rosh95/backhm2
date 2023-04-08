"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.emailUserMiddleware = exports.passwordUserMiddleware = exports.loginUserMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.loginUserMiddleware = (0, express_validator_1.body)('login').isString().trim().isLength({
    min: 3,
    max: 10
}).matches('^[a-zA-Z0-9_-]*$').withMessage('login should be between 6 and 20 symbols string');
exports.passwordUserMiddleware = (0, express_validator_1.body)('password').isString().trim().isLength({
    min: 6,
    max: 20
}).withMessage('password should be between 6 and 20 symbols string');
exports.emailUserMiddleware = (0, express_validator_1.body)('email').isString().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email should be correct:)');
exports.userValidation = [exports.loginUserMiddleware, exports.passwordUserMiddleware, exports.emailUserMiddleware];
