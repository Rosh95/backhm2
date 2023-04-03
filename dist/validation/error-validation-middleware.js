"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const errorsValidationMiddleware = (req, res, next) => {
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
exports.errorsValidationMiddleware = errorsValidationMiddleware;
