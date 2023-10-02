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
const jwt_service_1 = require("../application/jwt-service");
const auth_validation_middleware_1 = require("../validation/auth-validation-middleware");
const users_validation_1 = require("../validation/users-validation");
const error_validation_middleware_1 = require("../validation/error-validation-middleware");
const email_adapter_1 = require("../adapters/email-adapter");
const auth_service_1 = require("../domain/auth-service");
const users_service_1 = require("../domain/users-service");
exports.authRouter = (0, express_1.Router)({});
const whiteList = {
    accessToken: '',
    refreshToken: ''
};
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield auth_service_1.authService.checkCredential(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = yield jwt_service_1.jwtService.createJWT(user);
        const refreshToken = yield jwt_service_1.jwtService.createRefreshJWT(user);
        whiteList.accessToken = token.accessToken;
        whiteList.refreshToken = refreshToken.refreshToken;
        res.cookie('refreshToken', refreshToken.refreshToken, { httpOnly: true, secure: true });
        res.header('accessToken', token.accessToken);
        return res.status(200).send(token);
    }
    else {
        return res.sendStatus(401);
    }
}));
exports.authRouter.post('/refresh-token', auth_validation_middleware_1.checkRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken !== whiteList.refreshToken) {
        return res.status(401).send({ message: 'it isn`t valid refresh token' });
    }
    const currentUserId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
    const currentUser = currentUserId ? yield users_service_1.userService.findUserById(currentUserId.toString()) : null;
    if (currentUser) {
        const newAccesstoken = yield jwt_service_1.jwtService.createJWT(currentUser);
        const newRefreshToken = yield jwt_service_1.jwtService.createRefreshJWT(currentUser);
        whiteList.accessToken = newAccesstoken.accessToken;
        whiteList.refreshToken = newRefreshToken.refreshToken;
        return res
            .cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true })
            .header('accessToken', newAccesstoken.accessToken)
            .status(200).send(newAccesstoken);
    }
    return res.sendStatus(401);
}));
exports.authRouter.post('/logout', auth_validation_middleware_1.checkRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    whiteList.refreshToken = '';
    return res
        .clearCookie('refreshToken')
        .sendStatus(204);
}));
exports.authRouter.get('/me', auth_validation_middleware_1.authValidationINfoMiddleware, auth_validation_middleware_1.checkAccessTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    if (accessToken !== whiteList.accessToken) {
        return res.status(401).send({ message: 'it isn`t valid access token' });
    }
    const currentUserInfo = {
        login: req.user.accountData.login,
        email: req.user.accountData.email,
        userId: req.user._id.toString()
    };
    if (req.user) {
        return res.status(200).send(currentUserInfo);
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
    const newUser = yield auth_service_1.authService.createUser(userPostInputData);
    if (newUser) {
        res.sendStatus(204);
    }
    return res.sendStatus(400);
}));
exports.authRouter.post('/registration-confirmation', auth_validation_middleware_1.isEmailConfirmatedMiddlewareByCode, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const result = yield auth_service_1.authService.confirmEmail(code);
    if (result) {
        return res.sendStatus(204);
    }
    return res.sendStatus(400);
}));
exports.authRouter.post('/registration-email-resending', users_validation_1.emailUserMiddleware, auth_validation_middleware_1.isEmailConfirmatedMiddlewareByEmail, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const currentUser = yield auth_service_1.authService.changeUserConfirmationcode(email);
    if (currentUser) {
        try {
            yield email_adapter_1.emailAdapter.sendConfirmationEmail(currentUser.emailConfirmation.confirmationCode, email);
        }
        catch (e) {
            return null;
        }
        return res.sendStatus(204);
    }
    return res.sendStatus(400);
}));
