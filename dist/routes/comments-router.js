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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../domain/comments-service");
const auth_validation_middleware_1 = require("../validation/auth-validation-middleware");
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const comments_validation_middleware_1 = require("../validation/comments-validation-middleware");
const error_validation_middleware_1 = require("../validation/error-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_query_repository_1.commentQueryRepository.getAllComments();
    return res.send(comments);
}));
exports.commentsRouter.get('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentInfo = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
    if (!commentInfo) {
        return res.send(404);
    }
    return res.send(commentInfo);
}));
exports.commentsRouter.delete('/:commentId', auth_validation_middleware_1.authValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentInfo = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
        if (!commentInfo) {
            return res.send(404);
        }
        const isDeleted = yield comments_service_1.commentsService.deleteCommentById(req.params.commentId);
        if (isDeleted) {
            return res.sendStatus(204);
        }
        else
            return res.sendStatus(404);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.commentsRouter.put('/:commentId', auth_validation_middleware_1.authValidationMiddleware, comments_validation_middleware_1.CommentContentPostMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentInfo = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
        if (!commentInfo) {
            return res.send(404);
        }
        const updatedComment = yield comments_service_1.commentsService.updateCommentById(req.params.commentId, req.body.content);
        if (!updatedComment) {
            return res.send(404);
        }
        return res.send(204);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
