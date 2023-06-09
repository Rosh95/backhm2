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
exports.commentsMapping = exports.usersMapping = exports.postMapping = exports.countTotalUsersAndPages = exports.countTotalPostsAndPages = exports.countTotalCommentsAndPages = exports.countTotalBlogsAndPages = exports.countTotalPostsAndPagesOfBlog = exports.skipPages = exports.blogMapping = exports.getDataFromQuery = void 0;
const blog_query_repository_1 = require("../repositories/blog/blog-query-repository");
const user_query_repository_1 = require("../repositories/user/user-query-repository");
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const getDataFromQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = query.pageNumber ? +query.pageNumber : 1; // NaN
    let pageSize = query.pageSize ? +query.pageSize : 10; // NaN
    let sortBy = query.sortBy ? query.sortBy : 'createdAt';
    let sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    let searchNameTerm = query.searchNameTerm ? query.searchNameTerm : '';
    let searchLoginTerm = query.searchLoginTerm ? query.searchLoginTerm : '';
    let searchEmailTerm = query.searchEmailTerm ? query.searchEmailTerm : '';
    let skippedPages = skipPages(pageNumber, pageSize);
    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
        searchLoginTerm,
        searchEmailTerm,
        skippedPages
    };
});
exports.getDataFromQuery = getDataFromQuery;
function blogMapping(blog) {
    const blogMongoId = blog._id.toString();
    return {
        id: blogMongoId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership
    };
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
const countTotalCommentsAndPages = (queryData, filter) => __awaiter(void 0, void 0, void 0, function* () {
    let commentsTotalCount = yield comment_query_repository_1.commentQueryRepository.getAllCommentsWithFilter(filter);
    let commentsPagesCount = Math.ceil(commentsTotalCount / queryData.pageSize);
    return {
        commentsTotalCount,
        commentsPagesCount,
    };
});
exports.countTotalCommentsAndPages = countTotalCommentsAndPages;
const countTotalPostsAndPages = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    let postsTotalCount = yield blog_query_repository_1.blogQueryRepository.getAllPostsCount();
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);
    return {
        postsTotalCount,
        postsPagesCount,
    };
});
exports.countTotalPostsAndPages = countTotalPostsAndPages;
const countTotalUsersAndPages = (queryData, filter) => __awaiter(void 0, void 0, void 0, function* () {
    let usersTotalCount = yield user_query_repository_1.usersQueryRepository.getAllUsersCount(filter);
    let usersPagesCount = Math.ceil(usersTotalCount / queryData.pageSize);
    return {
        usersTotalCount,
        usersPagesCount,
    };
});
exports.countTotalUsersAndPages = countTotalUsersAndPages;
function postMapping(post) {
    const postMongoId = post._id.toString();
    return {
        id: postMongoId,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString()
    };
}
exports.postMapping = postMapping;
function usersMapping(user) {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt.toISOString(),
        emailConfirmation: {
            confirmationCode: user.emailConfirmation.confirmationCode,
            emailExpiration: user.emailConfirmation.emailExpiration,
            isConfirmed: user.emailConfirmation.isConfirmed
        }
    };
}
exports.usersMapping = usersMapping;
function commentsMapping(comment) {
    const commentMongoId = comment._id.toString();
    return {
        id: commentMongoId,
        content: comment.content,
        commentatorInfo: {
            userId: comment.userId.toString(),
            userLogin: comment.userLogin
        },
        createdAt: comment.createdAt.toISOString()
    };
}
exports.commentsMapping = commentsMapping;
