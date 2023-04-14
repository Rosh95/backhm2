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
exports.authValidationMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_service_1 = require("../domain/users-service");
const authValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token.toString());
    if (userId) {
        req.user = yield users_service_1.userService.findUserById(userId.toString());
        next();
        return;
    }
    res.sendStatus(401);
});
exports.authValidationMiddleware = authValidationMiddleware;
