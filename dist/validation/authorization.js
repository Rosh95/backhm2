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
exports.basicAuthMiddleware = void 0;
const basicAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginAndPassword = Buffer.from('admin:qwerty').toString('base64');
    let authorizationMethod = req.headers.authorization ? req.headers.authorization.split(' ')[0] : undefined;
    let authorizationPart = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    let isBasicauthorizationMethod = (authorizationMethod === null || authorizationMethod === void 0 ? void 0 : authorizationMethod.toLowerCase()) !== 'Basic'.toLowerCase();
    let isTrueLoginAndPassword = authorizationPart !== loginAndPassword;
    if (isBasicauthorizationMethod || isTrueLoginAndPassword) {
        res.sendStatus(401);
    }
    else {
        next();
    }
});
exports.basicAuthMiddleware = basicAuthMiddleware;
