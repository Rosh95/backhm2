"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const testing_router_1 = require("./routes/testing-router");
const app = (0, express_1.default)();
const port = process.env.port || 3001;
const parserMiddleWare = express_1.default.json();
app.use(parserMiddleWare);
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/posts', posts_router_1.postsRouter);
app.use('/testing/all-data', testing_router_1.testRouter);
app.use('/', (req, res) => {
    res.send('Siiiiii');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
