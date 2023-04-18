"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.checkExistUserMiddleware = exports.emailUserMiddleware = exports.passwordUserMiddleware = exports.loginUserMiddleware = void 0;
const express_validator_1 = require("express-validator");
const users_service_1 = require("../domain/users-service");
exports.loginUserMiddleware = (0, express_validator_1.body)('login').isString().trim().isLength({
    min: 3,
    max: 10
}).matches('^[a-zA-Z0-9_-]*$').withMessage('login should be between 3 and 10 symbols string');
exports.passwordUserMiddleware = (0, express_validator_1.body)('password').isString().trim().isLength({
    min: 6,
    max: 20
}).withMessage('password should be between 6 and 20 symbols string');
exports.emailUserMiddleware = (0, express_validator_1.body)('email').isString().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email should be correct:)');
exports.checkExistUserMiddleware = (0, express_validator_1.body)('login').isString().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    let foundUser = yield users_service_1.userService.findUserByLogin(value);
    if (foundUser) {
        throw new Error('This login already exist. Please, choose another one.');
    }
    return true;
}));
exports.userValidation = [exports.loginUserMiddleware, exports.passwordUserMiddleware, exports.emailUserMiddleware, exports.checkExistUserMiddleware];
