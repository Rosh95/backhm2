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
const post_query_repository_1 = require("../repositories/post/post-query-repository");
const post_service_1 = require("../domain/post-service");
const query_validation_1 = require("../validation/query-validation");
const auth_validation_middleware_1 = require("../validation/auth-validation-middleware");
const comments_validation_middleware_1 = require("../validation/comments-validation-middleware");
const comments_service_1 = require("../domain/comments-service");
const comment_query_repository_1 = require("../repositories/comment/comment-query-repository");
const blog_query_repository_1 = require("../repositories/blog/blog-query-repository");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', query_validation_1.queryValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
        const allPosts = yield post_query_repository_1.postQueryRepository.getAllPosts(queryData);
        return res.send(allPosts);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let foundPost = yield post_query_repository_1.postQueryRepository.findPostById(req.params.id);
        if (foundPost) {
            return res.send(foundPost);
        }
        return res.sendStatus(404);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.postsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield post_service_1.postService.deletePost(req.params.id);
    if (isDeleted) {
        return res.sendStatus(204);
    }
    else
        return res.sendStatus(404);
}));
exports.postsRouter.post('/', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.postValidation, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlogName = yield blog_query_repository_1.blogQueryRepository.findBlogById(req.body.blogId);
    if (!foundBlogName) {
        return res.sendStatus(404);
    }
    try {
        let postInputData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        };
        const newPost = yield post_service_1.postService.createPost(postInputData, foundBlogName);
        return res.status(201).send(newPost);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.postsRouter.put('/:id', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.postValidation, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updatedPostData = {
            content: req.body.content,
            title: req.body.title,
            shortDescription: req.body.shortDescription
        };
        let isPostUpdated = yield post_service_1.postService.updatePost(req.params.id, updatedPostData);
        if (isPostUpdated) {
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
exports.postsRouter.post('/:postId/comments', auth_validation_middleware_1.authValidationMiddleware, comments_validation_middleware_1.CommentContentPostMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPost = yield post_query_repository_1.postQueryRepository.findPostById(req.params.postId);
    if (!currentPost) {
        return res.sendStatus(404);
    }
    try {
        if (!req.user) {
            throw new Error('user doesn`t exist');
        }
        const newCommentData = {
            content: req.body.content,
            userId: req.user._id,
            userLogin: req.user.accountData.login,
            postId: req.params.postId
        };
        const newComment = yield comments_service_1.commentsService.createCommentForPost(newCommentData);
        console.log(newComment + ' new comment ');
        return res.status(201).send(newComment);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}));
exports.postsRouter.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPost = yield post_query_repository_1.postQueryRepository.findPostById(req.params.postId);
    if (!currentPost) {
        return res.sendStatus(404);
    }
    try {
        let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
        const comments = yield comment_query_repository_1.commentQueryRepository.getAllCommentsOfPost(req.params.postId, queryData);
        return res.send(comments);
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
