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
exports.blogQueryRepository = void 0;
const dbMongo_1 = require("../../db/dbMongo");
const helpers_1 = require("../../helpers/helpers");
exports.blogQueryRepository = {
    getAllBlogs(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { name: { $regex: queryData.searchNameTerm, $options: 'i' } };
            const blogs = yield dbMongo_1.blogsCollection.find(filter)
                .sort({ [queryData.sortByProp]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize).toArray();
            let blogViewArray = blogs.map(blog => (0, helpers_1.blogMapping)(blog));
            let pagesCount = yield (0, helpers_1.countTotalBlogsAndPages)(queryData, filter);
            return {
                pagesCount: pagesCount.blogsPagesCount,
                page: queryData.pageNumber,
                pageSize: queryData.pageSize,
                totalCount: pagesCount.blogsTotalCount,
                items: blogViewArray
            };
        });
    },
    getAllPostOfBlog(blogId, queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts = yield dbMongo_1.postsCollection.find({ blogId })
                .sort({ [queryData.sortByProp]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize)
                .toArray();
            let postViewArray = posts.map(post => (0, helpers_1.postMapping)(post));
            let pagesCount = yield (0, helpers_1.countTotalPostsAndPagesOfBlog)(blogId, queryData);
            return {
                pagesCount: pagesCount.postsPagesCount,
                page: queryData.pageNumber,
                pageSize: queryData.pageSize,
                totalCount: pagesCount.postsTotalCount,
                items: postViewArray
            };
        });
    },
    getAllPostCountOfBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.postsCollection.countDocuments({ blogId: blogId });
        });
    },
    getAllBlogsCount(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.blogsCollection.countDocuments(filter);
        });
    },
    getAllPostsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.postsCollection.countDocuments();
        });
    },
};
