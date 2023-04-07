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
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_validation_middleware_1 = require("../validation/posts-validation-middleware");
const authorization_1 = require("../validation/authorization");
const error_validation_middleware_1 = require("../validation/error-validation-middleware");
const helpers_1 = require("../helpers/helpers");
const post_query_repository_1 = require("../repositories/post-query-repository");
const post_service_1 = require("../domain/post-service");
const query_validation_1 = require("../validation/query-validation");
const blog_repository_1 = require("../repositories/blog-repository");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', query_validation_1.queryValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
    const allPosts = yield post_query_repository_1.postQueryRepository.getAllPosts(queryData);
    return res.send(allPosts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundPost = yield post_service_1.postService.findPostById(req.params.id);
    if (foundPost) {
        res.send(foundPost);
        return;
    }
    res.sendStatus(404);
}));
exports.postsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield post_service_1.postService.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.postsRouter.post('/', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.postValidation, posts_validation_middleware_1.blogIdMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlogName = yield blog_repository_1.blogRepository.findBlogById(req.body.blogId);
    if (!foundBlogName) {
        return res.sendStatus(404);
    }
    const newPost = yield post_service_1.postService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, foundBlogName);
    return res.status(201).send(newPost);
}));
exports.postsRouter.put('/:id', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.postValidation, posts_validation_middleware_1.blogIdMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedPost = yield post_service_1.postService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
    if (updatedPost) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
