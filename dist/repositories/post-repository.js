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
exports.postRepository = void 0;
const dbMongo_1 = require("../db/dbMongo");
exports.postRepository = {
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return dbMongo_1.postsCollection.find({}).toArray();
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield dbMongo_1.postsCollection.findOne({ id: id.toString() });
            return foundBlog;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.postsCollection.deleteOne({ id: id.toString() });
            return result.deletedCount === 1;
            // for (let i = 0; i < db.posts.length; i++) {
            //     if (+db.posts[i].id === id) {
            //         db.posts.splice(i, 1)
            //         return true;
            //     }
            // }
            // return false;
        });
    },
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let findBlogName = yield dbMongo_1.blogsCollection.findOne({ id: blogId.toString() });
            let newPost = {
                id: `${Date.now()}`,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: findBlogName ? findBlogName.name : 'not found',
                createdAt: new Date().toISOString()
            };
            const result = yield dbMongo_1.postsCollection.insertOne(newPost);
            //      db.posts.push(newPost);
            return newPost;
        });
    },
    updatePost(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.blogsCollection.updateOne({ id: id.toString() }, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    createdAt: new Date().toISOString(),
                }
            });
            return result.matchedCount === 1;
        });
    }
    //     let foundPost = await postRepository.findPostById(id);
    //     if (foundPost) {
    //         foundPost.title = title;
    //         foundPost.shortDescription = shortDescription;
    //         foundPost.content = content;
    //         foundPost.blogId = blogId;
    //         foundPost.createdAt = new Date().toISOString()
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
};
