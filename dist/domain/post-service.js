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
exports.postService = void 0;
const post_repository_1 = require("../repositories/post/post-repository");
const blog_repository_1 = require("../repositories/blog/blog-repository");
const mongodb_1 = require("mongodb");
exports.postService = {
    findPosts(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_repository_1.postRepository.findPosts();
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_repository_1.postRepository.findPostById(id);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_repository_1.postRepository.deletePost(id);
        });
    },
    createPost(title, shortDescription, content, blogId, foundBlogName) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPost = {
                _id: new mongodb_1.ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlogName.name,
                createdAt: new Date()
            };
            return yield post_repository_1.postRepository.createPost(newPost);
        });
    },
    createPostForExistingBlog(blogId, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundBlog = yield blog_repository_1.blogRepository.findBlogById(blogId);
            let newPost = {
                _id: new mongodb_1.ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: new Date()
            };
            return yield post_repository_1.postRepository.createPostForExistingBlog(newPost);
        });
    },
    updatePost(id, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_repository_1.postRepository.updatePost(id, title, shortDescription, content);
        });
    }
};
