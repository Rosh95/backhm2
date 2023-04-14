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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.MONGO_URL;
//const mongoURI = process.env.mongoURI || url;
if (!url) {
    throw new Error('Url doesn`t found');
}
const client = new mongodb_1.MongoClient(url);
const db = client.db();
exports.blogsCollection = db.collection('blogs');
exports.postsCollection = db.collection('posts');
exports.usersCollection = db.collection('users');
exports.commentsCollection = db.collection('comments');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Connected successfully to mongo server');
        }
        catch (e) {
            console.log('Can`t connect to mongo server');
            yield client.close();
        }
    });
}
exports.runDb = runDb;
