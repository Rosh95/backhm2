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
exports.commentRepository = void 0;
const dbMongo_1 = require("../../db/dbMongo");
const helpers_1 = require("../../helpers/helpers");
const mongodb_1 = require("mongodb");
exports.commentRepository = {
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield dbMongo_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(commentId) });
            if (comment) {
                return (0, helpers_1.commentsMapping)(comment);
            }
            return null;
        });
    },
    createCommentForPost(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbMongo_1.commentsCollection.insertOne(newComment);
            return (0, helpers_1.commentsMapping)(newComment);
        });
    },
    deleteCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
            console.log(result);
            return result.deletedCount === 1;
        });
    },
    updatedCommentById(commentId, commentContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(commentId) }, {
                $set: {
                    content: commentContent,
                }
            });
            return result.matchedCount === 1;
        });
    }
};
