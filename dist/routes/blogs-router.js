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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_validation_middleware_1 = require("../validation/blogs-validation-middleware");
const authorization_1 = require("../validation/authorization");
const error_validation_middleware_1 = require("../validation/error-validation-middleware");
const blog_service_1 = require("../domain/blog-service");
const blog_repository_1 = require("../repositories/blog-repository");
const posts_validation_middleware_1 = require("../validation/posts-validation-middleware");
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const helpers_1 = require("../helpers/helpers");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let queryData = (0, helpers_1.getDataFromQuery)(req);
    const allBlogs = yield blog_query_repository_1.blogQueryRepository.getAllBlogs(queryData);
    return res.send(allBlogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlog = yield blog_service_1.blogService.findBlogById(req.params.id);
    if (foundBlog) {
        res.send(foundBlog);
        return;
    }
    res.sendStatus(404);
}));
exports.blogsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blog_service_1.blogService.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.blogsRouter.post('/', authorization_1.basicAuthMiddleware, blogs_validation_middleware_1.websiteUrlBlogMiddleware, blogs_validation_middleware_1.nameBlogMiddleware, blogs_validation_middleware_1.descriptionBlogMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blog_service_1.blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(newBlog);
}));
exports.blogsRouter.put('/:id', authorization_1.basicAuthMiddleware, blogs_validation_middleware_1.websiteUrlBlogMiddleware, blogs_validation_middleware_1.nameBlogMiddleware, blogs_validation_middleware_1.descriptionBlogMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlog = yield blog_service_1.blogService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (foundBlog) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isExistBlog = yield blog_repository_1.blogRepository.findBlogById(req.params.id);
    if (!isExistBlog) {
        return res.sendStatus(404);
    }
    try {
        let queryData = (0, helpers_1.getDataFromQuery)(req);
        let foundPosts = yield blog_query_repository_1.blogQueryRepository.getAllPostOfBlog(req.params.id, queryData);
        //let pagesCount = await countTotalPostsAndPagesOfBlog(req, queryData);
        // let postsTotalCount = await blogQueryRepository.getAllPostCount(req.params.id);
        // let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);
        // const result = {
        //     pagesCount: pagesCount.postsPagesCount,
        //     page: queryData.pageNumber,
        //     pageSize: queryData.pageSize,
        //     totalCount: pagesCount.postsTotalCount,
        //     items: foundBlogs
        //
        // }
        // if (foundBlogs) {
        //     res.send(result)
        //     return;
        // }
        // res.sendStatus(404)
        return res.send(foundPosts);
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
exports.blogsRouter.post('/:id/posts', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isExistBlog = yield blog_repository_1.blogRepository.findBlogById(req.params.id);
    if (!isExistBlog) {
        return res.sendStatus(404);
    }
    try {
        const newPost = yield blog_query_repository_1.blogQueryRepository.createPostForExistingBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
        return res.status(201).send(newPost);
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
