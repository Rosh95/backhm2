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
exports.blogService = void 0;
const blog_repository_1 = require("../repositories/blog-repository");
exports.blogService = {
    findBlogs(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_repository_1.blogRepository.findBlogs(queryData);
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_repository_1.blogRepository.findBlogById(id);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_repository_1.blogRepository.deleteBlog(id);
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_repository_1.blogRepository.createBlog(name, description, websiteUrl);
        });
    },
    updateBlog(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_repository_1.blogRepository.updateBlog(id, name, description, websiteUrl);
        });
    }
};
