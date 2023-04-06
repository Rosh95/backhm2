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
exports.postMapping = exports.countTotalPostsAndPages = exports.countTotalBlogsAndPages = exports.countTotalPostsAndPagesOfBlog = exports.skipPages = exports.blogMapping = exports.getDataFromQuery = void 0;
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const getDataFromQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // export const getDataFromQuery = (req: Request): queryDataType => {
    // const pageNumberFromQuery: any = req.query.pageNumber
    // const pageNumber = parseInt(pageNumberFromQuery, 10)
    // if (pageNumber)
    let pageNumber = query.pageNumber ? +query.pageNumber : 1; // NaN
    let pageSize = query.pageSize ? +query.pageSize : 10; // NaN
    let sortByProp = query.sortBy ? (query.sortBy).toString() : 'createdAt';
    let sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    let searchNameTerm = query.searchNameTerm ? query.searchNameTerm : '';
    let skippedPages = skipPages(pageNumber, pageSize);
    return {
        pageNumber,
        pageSize,
        sortByProp,
        sortDirection,
        searchNameTerm,
        skippedPages
    };
});
exports.getDataFromQuery = getDataFromQuery;
function blogMapping(blog) {
    const blogMongoId = blog._id.toString();
    delete blog._id;
    return Object.assign({ id: blogMongoId }, blog);
}
exports.blogMapping = blogMapping;
function skipPages(pageNumber, pageSize) {
    return (+pageNumber - 1) * (+pageSize);
}
exports.skipPages = skipPages;
const countTotalPostsAndPagesOfBlog = (id, queryData) => __awaiter(void 0, void 0, void 0, function* () {
    let postsTotalCount = yield blog_query_repository_1.blogQueryRepository.getAllPostCountOfBlog(id);
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);
    return {
        postsTotalCount,
        postsPagesCount,
    };
});
exports.countTotalPostsAndPagesOfBlog = countTotalPostsAndPagesOfBlog;
const countTotalBlogsAndPages = (queryData, filter) => __awaiter(void 0, void 0, void 0, function* () {
    let blogsTotalCount = yield blog_query_repository_1.blogQueryRepository.getAllBlogsCount(filter);
    let blogsPagesCount = Math.ceil(blogsTotalCount / queryData.pageSize);
    return {
        blogsTotalCount,
        blogsPagesCount,
    };
});
exports.countTotalBlogsAndPages = countTotalBlogsAndPages;
const countTotalPostsAndPages = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    let postsTotalCount = yield blog_query_repository_1.blogQueryRepository.getAllPostsCount();
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);
    return {
        postsTotalCount,
        postsPagesCount,
    };
});
exports.countTotalPostsAndPages = countTotalPostsAndPages;
function postMapping(post) {
    const postMongoId = post._id.toString();
    delete post._id;
    return Object.assign(Object.assign({ id: postMongoId }, post), { createdAt: post.createdAt.toISOString() });
}
exports.postMapping = postMapping;
