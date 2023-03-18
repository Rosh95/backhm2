"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const testing_router_1 = require("./routes/testing-router");
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const port = process.env.port || 3001;
exports.app = (0, express_1.default)();
const parserMiddleWare = express_1.default.json();
exports.app.use(parserMiddleWare);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/testing/all-data', testing_router_1.testRouter);
exports.app.use('/', (req, res) => {
    res.send('Siiiiii');
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
