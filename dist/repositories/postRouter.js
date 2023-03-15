"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const db_1 = require("../db/db");
exports.postRepository = {
    findBlogs() {
        return db_1.db.blogs;
    },
    findBlogById(id) {
        const foundBlog = db_1.db.blogs.find(b => +b.id === id);
        return foundBlog ? foundBlog : undefined;
    },
    deleteBlog(id) {
        for (let i = 0; i < db_1.db.blogs.length; i++) {
            if (+db_1.db.blogs[i].id === id) {
                db_1.db.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    createBlog(name, description, websiteUrl) {
        let newBlog = {
            id: `${Date.now()}`,
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        db_1.db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id, name, description, websiteUrl) {
        let foundBlog = exports.postRepository.findBlogById(id);
        if (foundBlog) {
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }
    }
};
