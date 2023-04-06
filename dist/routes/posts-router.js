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
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // let queryData: queryDataType = getDataFromQuery(req)
    // const posts = await postService.findBlogs(queryData);
    // let pagesCount = await countTotalBlogsAndPages(req, queryData);
    let queryData = yield (0, helpers_1.getDataFromQuery)(req.query);
    const allPosts = yield post_query_repository_1.postQueryRepository.getAllPosts(queryData);
    return res.send(allPosts);
    // let pageNumber = req.body.pageNumber ? req.body.pageNumber : '1';
    // let pageSize = req.body.pageSize ? req.body.pageSize : '10';
    // let sortByProp = req.body.sortBy ? req.body.sortBy : 'createdAt';
    // let sortDirection = req.body.sortDirection ? req.body.sortDirection : 'desc';
    //
    // const posts = await postRepository.findPosts();
    // let postsPagesCount = Math.ceil(+posts.length / +pageSize);
    // let postsTotalCount = +posts.length;
    //
    // const result = {
    //     pagesCount: postsPagesCount,
    //     page: pageNumber,
    //     pageSize: pageSize,
    //     totalCount: postsTotalCount,
    //     items: posts
    //
    // }
    // res.send(result)
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
exports.postsRouter.post('/', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, posts_validation_middleware_1.blogIdMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield post_service_1.postService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(newPost);
}));
exports.postsRouter.put('/:id', authorization_1.basicAuthMiddleware, posts_validation_middleware_1.titlePostMiddleware, posts_validation_middleware_1.shortDescriptionPostMiddleware, posts_validation_middleware_1.contentPostMiddleware, posts_validation_middleware_1.blogIdMiddleware, error_validation_middleware_1.errorsValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedPost = yield post_service_1.postService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
    if (updatedPost) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
