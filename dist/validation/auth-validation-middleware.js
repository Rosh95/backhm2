"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.isEmailConfirmatedMiddlewareByEmail = exports.isEmailConfirmatedMiddlewareByCode = exports.checkExistUserMiddleware = exports.checkAccessTokenMiddleware = exports.checkRefreshTokenMiddleware = exports.authValidationMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_service_1 = require("../domain/users-service");
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const user_repository_1 = require("../repositories/user/user-repository");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const settings_1 = require("../settings");
const authValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token.toString());
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
const checkRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // debugger
    const refreshToken = req.cookies.refreshToken;
    // debugger
    if (!refreshToken) {
        res.send(401);
        return;
    }
    //   debugger
    jsonwebtoken_1.default.verify(refreshToken, settings_1.settings.JWT_REFRESH_SECRET, (err, decoded) => {
        console.log(err, decoded);
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).send({ success: false, message: 'Unauthorized! ref Access Token was expired!' });
        }
        if (err instanceof jsonwebtoken_1.NotBeforeError) {
            return res.status(401).send({ success: false, message: 'jwt refresh not active' });
        }
        // if (err instanceof JsonWebTokenError) {
        //     return res.status(401).send({success: false, message: 'jwt refresh malformed'});
        // }
        return;
    });
    //   debugger
    next();
    return;
});
exports.checkRefreshTokenMiddleware = checkRefreshTokenMiddleware;
const checkAccessTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   debugger
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    debugger;
    const accessToken = req.headers.authorization.split(' ')[1];
    //  debugger
    jsonwebtoken_1.default.verify(accessToken, settings_1.settings.JWT_SECRET, (err, decoded) => {
        console.log(err, decoded);
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).send({ success: false, message: 'Unauthorized! Access Token was expired!' });
        }
        if (err instanceof jsonwebtoken_1.NotBeforeError) {
            return res.status(401).send({ success: false, message: 'jwt access not active' });
        }
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).send({ success: false, message: 'jwt access malformed' });
        }
        return true;
    });
    next();
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
