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
const dbMongo_1 = require("../../db/dbMongo");
const mongodb_1 = require("mongodb");
const helpers_1 = require("../../helpers/helpers");
exports.postRepository = {
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield dbMongo_1.postsCollection.find({}).toArray();
            return posts.map(post => (0, helpers_1.postMapping)(post));
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield dbMongo_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return foundPost ? (0, helpers_1.postMapping)(foundPost) : null;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const result = yield dbMongo_1.postsCollection.insertOne(newPost);
            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };
        });
    },
    createPostForExistingBlog(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const result = yield dbMongo_1.postsCollection.insertOne(newPost);
            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };
        });
    },
    updatePost(id, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                }
            });
            return result.matchedCount === 1;
        });
    }
};
