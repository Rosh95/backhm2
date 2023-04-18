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
const blog_repository_1 = require("../repositories/blog/blog-repository");
const posts_validation_middleware_1 = require("../validation/posts-validation-middleware");
const blog_query_repository_1 = require("../repositories/blog/blog-query-repository");
const helpers_1 = require("../helpers/helpers");
const query_validation_1 = require("../validation/query-validation");
const post_service_1 = require("../domain/post-service");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', query_validation_1.queryValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
        const allBlogs = yield blog_query_repository_1.blogQueryRepository.getAllBlogs(queryData);
        return res.send(allBlogs);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlog = yield blog_service_1.blogService.findBlogById(req.params.id);
    if (foundBlog) {
        return res.send(foundBlog);
    }
    return res.sendStatus(404);
}));
exports.blogsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blog_service_1.blogService.deleteBlog(req.params.id);
    if (isDeleted) {
        return res.sendStatus(204);
    }
    else
        return res.sendStatus(404);
}));
exports.blogsRouter.post('/', authorization_1.basicAuthMiddleware, blogs_validation_middleware_1.blogValidation, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let BlogInputData = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        };
        const newBlog = yield blog_service_1.blogService.createBlog(BlogInputData);
        return res.status(201).send(newBlog);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.blogsRouter.put('/:id', authorization_1.basicAuthMiddleware, blogs_validation_middleware_1.blogValidation, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let BlogUpdateData = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        };
        const isBlogUpdate = yield blog_service_1.blogService.updateBlog(req.params.id, BlogUpdateData);
        if (isBlogUpdate) {
            return res.sendStatus(204);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.blogsRouter.get('/:id/posts', query_validation_1.queryValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isExistBlog = yield blog_repository_1.blogRepository.findBlogById(req.params.id);
    if (!isExistBlog) {
        res.sendStatus(404);
        return;
    }
    try {
        let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
        let foundPosts = yield blog_query_repository_1.blogQueryRepository.getAllPostOfBlog(req.params.id, queryData);
        return res.send(foundPosts);
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
exports.blogsRouter.post('/:id/posts', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.postValidation, query_validation_1.queryValidation, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isExistBlog = yield blog_repository_1.blogRepository.findBlogById(req.params.id);
    if (!isExistBlog) {
        res.sendStatus(404);
        return;
    }
    try {
        let postInputData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        };
        const newPost = yield post_service_1.postService.createPostForExistingBlog(req.params.id, postInputData);
        return res.status(201).send(newPost);
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
