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
exports.blogRepository = void 0;
const dbMongo_1 = require("../db/dbMongo");
const mongodb_1 = require("mongodb");
function blogMapping(blog) {
    const blogMongoId = blog._id.toString();
    delete blog._id;
    return Object.assign({ id: blogMongoId }, blog);
}
function skipPages(pageNumber, pageSize) {
    let result = (+pageNumber - 1) * (+pageSize);
    return result;
}
exports.blogRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield dbMongo_1.blogsCollection.find({}).toArray();
            return blogs.map(blog => blogMapping(blog));
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield dbMongo_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return foundBlog ? blogMapping(foundBlog) : null;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBlog = {
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const result = yield dbMongo_1.blogsCollection.insertOne(newBlog);
            return {
                id: result.insertedId.toString(),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
                isMembership: newBlog.isMembership
            };
        });
    },
    updateBlog(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                }
            });
            return result.matchedCount === 1;
        });
    },
    // async getAllPostOfBlog(blogId: any, pageNumber: number, pageSize: number, sortByProp: string, sortDirection: string): Promise<postType[]> {
    //     let skippedPages = skipPages(pageNumber, pageSize);
    //     let sortDirectionInMongoDb: SortDirection = sortDirection === 'desc' ? -1 : 1;
    //     console.log(sortByProp, sortDirectionInMongoDb)
    //     let posts = await postsCollection.find({blogId})
    //         .sort({[sortByProp]: sortDirectionInMongoDb})
    //         .skip(skippedPages)
    //         .limit(pageSize)
    //         .toArray();
    //
    //
    //     return posts.map(post => postMapping(post))
    // },
    //
    // async getAllPostCount(blogIdd: any): Promise<number> {
    //
    //     let totalCount = await postsCollection.countDocuments({blogId: blogIdd})
    //
    //
    //     return totalCount;
    // },
    //
    //
    // async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<postType | boolean> {
    //     let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
    //
    //     let newPost: postType = {
    //         title: title,
    //         shortDescription: shortDescription,
    //         content: content,
    //         blogId: blogId,
    //         blogName: findBlogName!.name,
    //         createdAt: new Date()
    //     }
    //     const result = await postsCollection.insertOne(newPost)
    //
    //     return {
    //         id: result.insertedId.toString(),
    //         title: newPost.title,
    //         shortDescription: newPost.shortDescription,
    //         content: newPost.content,
    //         blogId: newPost.blogId,
    //         blogName: newPost.blogName,
    //         createdAt: newPost.createdAt
    //     };
    //
    // },
};
