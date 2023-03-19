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
const blog_repository_1 = require("../repositories/blog-repository");
const blogs_validation_middleware_1 = require("../validation/blogs-validation-middleware");
const authorization_1 = require("../validation/authorization");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_repository_1.blogRepository.findBlogs();
    res.send(blogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlog = yield blog_repository_1.blogRepository.findBlogById(+req.params.id);
    if (foundBlog) {
        res.send(foundBlog);
        return;
    }
    res.sendStatus(404);
}));
exports.blogsRouter.delete('/:id', authorization_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blog_repository_1.blogRepository.deleteBlog(+req.params.id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.blogsRouter.post('/', authorization_1.basicAuthMiddleware, blogs_validation_middleware_1.websiteUrlBlogMiddleware, blogs_validation_middleware_1.nameBlogMiddleware, blogs_validation_middleware_1.descriptionBlogMiddleware, blogs_validation_middleware_1.errorsBlogMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blog_repository_1.blogRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(newBlog);
}));
exports.blogsRouter.put('/:id', authorization_1.basicAuthMiddleware, blogs_validation_middleware_1.websiteUrlBlogMiddleware, blogs_validation_middleware_1.nameBlogMiddleware, blogs_validation_middleware_1.descriptionBlogMiddleware, blogs_validation_middleware_1.errorsBlogMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlog = yield blog_repository_1.blogRepository.updateBlog(+req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (foundBlog) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
