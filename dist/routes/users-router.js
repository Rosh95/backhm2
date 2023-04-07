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
exports.usersRouter = void 0;
const express_1 = require("express");
const query_validation_1 = require("../validation/query-validation");
const helpers_1 = require("../helpers/helpers");
const user_query_repository_1 = require("../repositories/user/user-query-repository");
const users_service_1 = require("../domain/users-service");
const authorization_1 = require("../validation/authorization");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', query_validation_1.queryValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
    const allUsers = yield user_query_repository_1.usersQueryRepository.getAllUsers(queryData);
    return res.send(allUsers);
}));
exports.usersRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield users_service_1.userService.deleteUser(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.usersRouter.post('/', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_service_1.userService.createUser(req.body.login, req.body.email, req.body.password);
    return res.status(201).send(newUser);
}));
