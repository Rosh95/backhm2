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
const dbMongo_1 = require("../../db/dbMongo");
const mongodb_1 = require("mongodb");
function blogMapping(blog) {
    const blogMongoId = blog._id.toString();
    delete blog._id;
    return Object.assign({ id: blogMongoId }, blog);
}
exports.blogRepository = {
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
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
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
};
