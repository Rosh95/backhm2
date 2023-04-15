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
const blog_repository_1 = require("../repositories/blog/blog-repository");
const mongodb_1 = require("mongodb");
exports.blogService = {
    // async findBlogs(queryData: queryDataType): Promise<BlogViewType[]> {
    //     return await blogRepository.findBlogs(queryData);
    // },
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
    createBlog(blogData) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBlog = {
                _id: new mongodb_1.ObjectId(),
                name: blogData.name,
                description: blogData.description,
                websiteUrl: blogData.websiteUrl,
                createdAt: new Date(),
                isMembership: false
            };
            return yield blog_repository_1.blogRepository.createBlog(newBlog);
        });
    },
    updateBlog(blogId, blogUpdateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_repository_1.blogRepository.updateBlog(blogId, blogUpdateData);
        });
    }
};
