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
const auth = require('basic-auth');
const basicAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await auth(req);
    // const username: string = 'admin';
    // const password: string = 'qwerty';
    // if (user && user.name.toLowerCase() === username && user.pass.toLowerCase() === password) {
    //     next()
    // } else {
    //     res.status(401).end('Please, authorize.')
    // }
    const loginAndPassword = Buffer.from('admin:qwerty').toString('base64');
    let authorizationPart = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    if (authorizationPart === loginAndPassword) {
        next();
    }
    else {
        res.status(401).end('Please, authorize.');
    }
});
exports.basicAuthMiddleware = basicAuthMiddleware;
