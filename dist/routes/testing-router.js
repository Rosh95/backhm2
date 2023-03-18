"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.testRouter = (0, express_1.Router)({});
exports.testRouter.delete('/', (req, res) => {
    console.log(db_1.db.blogs + ' before delete blogs');
    console.log(db_1.db.posts + ' before delete posts');
    if (db_1.db.blogs.length > 0) {
        db_1.db.blogs.splice(0);
        res.sendStatus(204);
    }
    console.log(db_1.db.blogs + ' after delete blogs');
    if (db_1.db.posts.length > 0) {
        db_1.db.posts.splice(0);
        res.sendStatus(204);
    }
    console.log(db_1.db.posts + ' after delete posts');
});
