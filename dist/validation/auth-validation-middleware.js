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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailConfirmatedMiddlewareByEmail = exports.isEmailConfirmatedMiddlewareByCode = exports.checkExistUserMiddleware = exports.checkAccessTokenMiddleware = exports.checkRefreshTokenMiddleware = exports.authValidationINfoMiddleware = exports.authValidationMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_service_1 = require("../domain/users-service");
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const user_repository_1 = require("../repositories/user/user-repository");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const authValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByAccessToken(token.toString());
    const commentUser = yield comment_query_repository_1.commentQueryRepository.getCommentById(req.params.commentId);
    if (userId) {
        let isCorrectUser = userId.toString() !== (commentUser === null || commentUser === void 0 ? void 0 : commentUser.commentatorInfo.userId.toString());
        if (commentUser && isCorrectUser) {
            return res.sendStatus(403);
        }
        req.user = yield users_service_1.userService.findUserById(userId.toString());
        next();
        return;
    }
    return res.sendStatus(401);
});
exports.authValidationMiddleware = authValidationMiddleware;
const authValidationINfoMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByAccessToken(token.toString());
    if (userId) {
        req.user = yield users_service_1.userService.findUserById(userId.toString());
        next();
        return;
    }
    return res.sendStatus(401);
});
exports.authValidationINfoMiddleware = authValidationINfoMiddleware;
const checkRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }
    try {
        const result = yield jsonwebtoken_1.default.verify(refreshToken, settings_1.settings.JWT_REFRESH_SECRET);
        if (result.userID && result.iat < result.exp) {
            console.log(result);
            next();
            return;
        }
        return res.sendStatus(401);
    }
    catch (e) {
        return res.sendStatus(401);
    }
});
exports.checkRefreshTokenMiddleware = checkRefreshTokenMiddleware;
const checkAccessTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    const result = jsonwebtoken_1.default.verify(accessToken, settings_1.settings.JWT_SECRET);
    if (result.userID && result.iat < result.exp) {
        console.log(result);
        next();
        return;
    }
    res.sendStatus(401);
    return;
});
exports.checkAccessTokenMiddleware = checkAccessTokenMiddleware;
const checkExistUserMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let foundUser = yield users_service_1.userService.findUserByLogin(req.body.login);
    if (!foundUser) {
        next();
        return;
    }
    return res.sendStatus(400);
});
exports.checkExistUserMiddleware = checkExistUserMiddleware;
// export const checkEmailConfirmationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     let foundUser = await userRepository.findUserByCode(req.body.code);
//
//     if (foundUser && foundUser.emailConfirmation.isConfirmed === false) {
//         next();
//         return;
//     }
//     return res.sendStatus(400);
// }
exports.isEmailConfirmatedMiddlewareByCode = (0, express_validator_1.body)('code').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    let foundUser = yield user_repository_1.userRepository.findUserByCode(value); //   console.log(`${blogsIdArray} exists blogID`)
    if (foundUser.emailConfirmation.isConfirmed) {
        throw new Error('This email has confirmed.');
    }
    return true;
})).withMessage('This email has confirmed');
exports.isEmailConfirmatedMiddlewareByEmail = (0, express_validator_1.body)('email').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    let foundUser = yield user_repository_1.userRepository.findUserByEmail(value);
    if (foundUser.emailConfirmation.isConfirmed) {
        console.log(foundUser);
        throw new Error('This email has confirmed.');
    }
    return true;
})).withMessage('This email has confired or we couldn`t find user');
