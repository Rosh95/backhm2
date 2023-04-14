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
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const comments_validation_middleware_1 = require("../validation/comments-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
// commentsRouter.post('/',
//     authValidationMiddleware,
//     async (req, res) => {
//         const newComment = await commentsService.sendComment(req.body.comment, req.user!._id)
//         res.status(201).send(newComment)
//     }
// )
exports.commentsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_query_repository_1.commentQueryRepository.getAllComments();
    res.send(comments);
}));
exports.commentsRouter.get('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentInfo = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
    if (!commentInfo) {
        res.send(404);
    }
    res.send(commentInfo);
}));
exports.commentsRouter.delete('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentInfo = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
    if (!commentInfo) {
        res.send(404);
    }
    const isDeleted = yield comments_service_1.commentsService.deleteCommentById(req.params.commentId);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.commentsRouter.put('/:commentId', comments_validation_middleware_1.CommentContentPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentInfo = yield comments_service_1.commentsService.getCommentById(req.params.commentId);
    if (!commentInfo) {
        res.send(404);
    }
    const updatedComment = yield comments_service_1.commentsService.updateCommentById(req.params.commentId, req.body.content);
    if (!updatedComment) {
        res.send(404);
    }
    res.send(204);
}));
