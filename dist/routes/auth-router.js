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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domain/users-service");
const jwt_service_1 = require("../application/jwt-service");
const auth_validation_middleware_1 = require("../validation/auth-validation-middleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', auth_validation_middleware_1.authValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        login: req.user.login,
        email: req.user.email,
        userId: req.user._id.toString()
    };
    if (req.user) {
        return res.send(currentUserInfo);
    }
    return res.sendStatus(404);
}));
exports.authRouter.post('/registration', 
// checkExistUserMiddleware,
// errorsValidationMiddleware,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: 'azi.rosh95@gmail.com',
            pass: 'rR12345678!', // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = yield transporter.sendMail({
        from: `Rosh <azi.rosh95@gmail.com>`,
        to: req.body.email,
        subject: req.body.subject,
        html: req.body.message, // html body
    });
    let userPostInputData = {
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    };
    const newUser = yield users_service_1.userService.createUser(userPostInputData);
    return res.sendStatus(204);
}));
