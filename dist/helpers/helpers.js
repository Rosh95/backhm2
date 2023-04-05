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
exports.countTotalBlogsAndPages = exports.countTotalPostsAndPagesOfBlog = exports.skipPages = exports.blogMapping = exports.getDataFromQuery = void 0;
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const getDataFromQuery = (req) => {
    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    let sortByProp = req.query.sortBy ? (req.query.sortBy).toString() : 'createdAt';
    let sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
    let skippedPages = skipPages(pageNumber, pageSize);
    return {
        pageNumber,
        pageSize,
        sortByProp,
        sortDirection,
        skippedPages
    };
};
exports.getDataFromQuery = getDataFromQuery;
function blogMapping(blog) {
    const blogMongoId = blog._id.toString();
    delete blog._id;
    return Object.assign({ id: blogMongoId }, blog);
}
exports.blogMapping = blogMapping;
function skipPages(pageNumber, pageSize) {
    let result = (+pageNumber - 1) * (+pageSize);
    return result;
}
exports.skipPages = skipPages;
const countTotalPostsAndPagesOfBlog = (req, queryData) => __awaiter(void 0, void 0, void 0, function* () {
    let postsTotalCount = yield blog_query_repository_1.blogQueryRepository.getAllPostCountOfBlog(req.params.id);
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);
    return {
        postsTotalCount,
        postsPagesCount,
    };
});
exports.countTotalPostsAndPagesOfBlog = countTotalPostsAndPagesOfBlog;
const countTotalBlogsAndPages = (req, queryData) => __awaiter(void 0, void 0, void 0, function* () {
    let blogsTotalCount = yield blog_query_repository_1.blogQueryRepository.getAllBlogsCount();
    let blogsPagesCount = Math.ceil(blogsTotalCount / queryData.pageSize);
    return {
        blogsTotalCount,
        blogsPagesCount,
    };
});
exports.countTotalBlogsAndPages = countTotalBlogsAndPages;
