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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domain/users-service");
const jwt_service_1 = require("../application/jwt-service");
const auth_validation_middleware_1 = require("../validation/auth-validation-middleware");
const users_validation_1 = require("../validation/users-validation");
const error_validation_middleware_1 = require("../validation/error-validation-middleware");
const email_adapter_1 = require("../adapters/email-adapter");
const auth_service_1 = require("../domain/auth-service");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', 
//   authValidationMiddleware,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield users_service_1.userService.checkCredential(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = yield jwt_service_1.jwtService.createJWT(user);
        res.status(200).send(token);
    }
    else {
        res.sendStatus(401);
    }
}));
exports.authRouter.get('/me', auth_validation_middleware_1.authValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserInfo = {
        login: req.user.accountData.login,
        email: req.user.accountData.email,
        userId: req.user._id.toString()
    };
    if (req.user) {
        return res.send(currentUserInfo);
    }
    return res.sendStatus(404);
}));
exports.authRouter.post('/registration', 
//  checkExistUserMiddleware,
users_validation_1.userValidation, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userPostInputData = {
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    };
    const newUser = yield users_service_1.userService.createUser(userPostInputData);
    if (newUser) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRouter.post('/registration-confirmation', auth_validation_middleware_1.checkEmailConfirmationMiddleware, auth_validation_middleware_1.isEmailConfirmatedMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const result = yield auth_service_1.authService.confirmEmail(code);
    if (result) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRouter.post('/registration-email-resending', users_validation_1.emailUserMiddleware, auth_validation_middleware_1.checkEmailConfirmationMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const currentUser = yield users_service_1.userService.findUserByEmail(email);
    if (currentUser) {
        try {
            yield email_adapter_1.emailAdapter.sendConfirmationEmail(currentUser.emailConfirmation.confirmationCode, email);
        }
        catch (e) {
            return null;
        }
        res.sendStatus(204);
    }
    return res.sendStatus(400);
}));
