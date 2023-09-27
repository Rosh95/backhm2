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
exports.postQueryRepository = void 0;
const helpers_1 = require("../../helpers/helpers");
const dbMongo_1 = require("../../db/dbMongo");
const mongodb_1 = require("mongodb");
exports.postQueryRepository = {
    getAllPosts(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield dbMongo_1.postsCollection.find()
                .sort({ [queryData.sortBy]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize).toArray();
            let postViewArray = posts.map(post => (0, helpers_1.postMapping)(post));
            let pagesCount = yield (0, helpers_1.countTotalPostsAndPages)(queryData);
            return {
                pagesCount: pagesCount.postsPagesCount,
                page: queryData.pageNumber,
                pageSize: queryData.pageSize,
                totalCount: pagesCount.postsTotalCount,
                items: postViewArray
            };
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield dbMongo_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return foundPost ? (0, helpers_1.postMapping)(foundPost) : null;
        });
    },
};
