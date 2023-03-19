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
const post_repository_1 = require("../repositories/post-repository");
const posts_validation_middleware_1 = require("../validation/posts-validation-middleware");
const authorization_1 = require("../validation/authorization");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_repository_1.postRepository.findPosts();
    res.send(posts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundPost = yield post_repository_1.postRepository.findPostById(+req.params.id);
    if (foundPost) {
        res.send(foundPost);
        return;
    }
    res.sendStatus(404);
}));
exports.postsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield post_repository_1.postRepository.deletePost(+req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.postsRouter.post('/', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, posts_validation_middleware_1.blogIdMiddleware, posts_validation_middleware_1.errorsPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield post_repository_1.postRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(newPost);
}));
exports.postsRouter.put('/:id', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, posts_validation_middleware_1.blogIdMiddleware, posts_validation_middleware_1.errorsPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedPost = yield post_repository_1.postRepository.updatePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (updatedPost) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
