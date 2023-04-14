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
exports.commentQueryRepository = void 0;
const dbMongo_1 = require("../../db/dbMongo");
const helpers_1 = require("../../helpers/helpers");
exports.commentQueryRepository = {
    getAllCommentsOfPost(postId, queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { postId: postId };
            const comments = yield dbMongo_1.commentsCollection.find(filter)
                .sort({ [queryData.sortBy]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize).toArray();
            let commentViewArray = comments.map(comment => (0, helpers_1.commentsMapping)(comment));
            let pagesCount = yield (0, helpers_1.countTotalCommentsAndPages)(queryData, filter);
            return {
                pagesCount: pagesCount.commentsPagesCount,
                page: queryData.pageNumber,
                pageSize: queryData.pageSize,
                totalCount: pagesCount.commentsTotalCount,
                items: commentViewArray
            };
        });
    },
    getAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            let comments = yield dbMongo_1.commentsCollection.find().toArray();
            return comments.map(comment => (0, helpers_1.commentsMapping)(comment));
        });
    },
    getAllCommentsWithFilter(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return dbMongo_1.commentsCollection.countDocuments(filter);
        });
    }
};
