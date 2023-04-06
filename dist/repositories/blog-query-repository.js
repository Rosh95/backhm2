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
const dbMongo_1 = require("../db/dbMongo");
const mongodb_1 = require("mongodb");
const helpers_1 = require("../helpers/helpers");
exports.blogQueryRepository = {
    getAllBlogs(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { name: { $regex: queryData.searchNameTerm, options: 'i' } };
            const blogs = yield dbMongo_1.blogsCollection.find(filter)
                .sort({ [queryData.sortByProp]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize).toArray();
            //   const countOfBlogs = await blogsCollection.countDocuments(filter)
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
            //let skippedPages = skipPages(queryData.pageNumber, queryData.pageSize);
            // let sortDirectionInMongoDb: SortDirection = sortDirection === 'desc' ? -1 : 1;
            //    .sort({[sortByProp]: sortDirectionInMongoDb})
            console.log(queryData.sortByProp, queryData.sortDirection);
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
    createPostForExistingBlog(blogId, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let findBlogName = yield dbMongo_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(blogId.toString()) });
            let newPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: findBlogName.name,
                createdAt: new Date()
            };
            // @ts-ignore
            const result = yield dbMongo_1.postsCollection.insertOne(newPost);
            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };
        });
    },
};
