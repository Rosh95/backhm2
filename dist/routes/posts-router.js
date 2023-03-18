"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const post_repository_1 = require("../repositories/post-repository");
const posts_validation_middleware_1 = require("../validation/posts-validation-middleware");
const authorization_1 = require("../validation/authorization");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    const posts = post_repository_1.postRepository.findPosts();
    res.send(posts);
});
exports.postsRouter.get('/:id', (req, res) => {
    let foundPost = post_repository_1.postRepository.findPostById(+req.params.id);
    if (foundPost) {
        res.send(foundPost);
        return;
    }
    res.sendStatus(404);
});
exports.postsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => {
    const isDeleted = post_repository_1.postRepository.deletePost(+req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
});
exports.postsRouter.post('/', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, posts_validation_middleware_1.blogIdMiddleware, posts_validation_middleware_1.errorsPostMiddleware, (req, res) => {
    const newPost = post_repository_1.postRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName);
    res.status(201).send(newPost);
});
exports.postsRouter.put('/:id', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, posts_validation_middleware_1.blogIdMiddleware, posts_validation_middleware_1.errorsPostMiddleware, (req, res) => {
    let uodatedPost = post_repository_1.postRepository.updatePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName);
    if (uodatedPost) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
