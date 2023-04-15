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
exports.commentsService = void 0;
const mongodb_1 = require("mongodb");
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const comment_repository_1 = require("../repositories/comment/comment-repository");
exports.commentsService = {
    sendComment(comment, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    },
    allFeedback(comment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return comment_query_repository_1.commentQueryRepository.getAllComments();
        });
    },
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_repository_1.commentRepository.getCommentById(commentId);
        });
    },
    deleteCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_repository_1.commentRepository.deleteCommentById(commentId);
        });
    },
    createCommentForPost(newCommentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                _id: new mongodb_1.ObjectId(),
                content: newCommentData.content,
                userId: newCommentData.userId,
                userLogin: newCommentData.userLogin,
                postId: newCommentData.postId,
                createdAt: new Date()
            };
            console.log(newComment + 'new comment in service');
            return yield comment_repository_1.commentRepository.createCommentForPost(newComment);
        });
    },
    updateCommentById(commentId, commentContent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_repository_1.commentRepository.updatedCommentById(commentId, commentContent);
        });
    }
};
