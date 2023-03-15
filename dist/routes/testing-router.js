"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.testRouter = (0, express_1.Router)({});
exports.testRouter.delete('/', (req, res) => {
    if (db_1.db.blogs.length > 0) {
        db_1.db.blogs.splice(0);
        res.sendStatus(204);
        return;
    }
    if (db_1.db.posts.length > 0) {
        db_1.db.posts.splice(0);
        res.sendStatus(204);
        return;
    }
});
