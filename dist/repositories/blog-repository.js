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
exports.blogRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.blogsCollection.find({}, { projection: { _id: false } }).toArray();
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield dbMongo_1.blogsCollection.findOne({ id: id.toString() }, { projection: { _id: false } });
            return foundBlog;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.blogsCollection.deleteOne({ id: id.toString() });
            return result.deletedCount === 1;
            // for (let i = 0; i < db.blogs.length; i++) {
            //     if (+db.blogs[i].id === id) {
            //         db.blogs.splice(i, 1)
            //         return true;
            //     }
            // }
            // return false;
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBlog = {
                id: `${Date.now()}`,
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const result = yield dbMongo_1.blogsCollection.insertOne(newBlog);
            //       db.blogs.push(newBlog);
            return newBlog;
        });
    },
    updateBlog(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.blogsCollection.updateOne({ id: id.toString() }, {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                    createdAt: new Date().toISOString(),
                    isMembership: false
                }
            });
            return result.matchedCount === 1;
            // let foundBlog = await blogRepository.findBlogById(id);
            // if (foundBlog) {
            //     foundBlog.name = name;
            //     foundBlog.description = description;
            //     foundBlog.websiteUrl = websiteUrl;
            //     return true;
            // } else {
            //     return false;
            // }
        });
    }
};
