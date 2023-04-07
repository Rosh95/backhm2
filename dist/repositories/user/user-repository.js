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
exports.userRepository = void 0;
const dbMongo_1 = require("../../db/dbMongo");
const helpers_1 = require("../../helpers/helpers");
exports.userRepository = {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.usersCollection.find().sort({ 'createdAt': -1 }).toArray();
        });
    },
    createBlog(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.usersCollection.insertOne(newUser);
            return (0, helpers_1.usersMapping)(newUser);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dbMongo_1.postsCollection.deleteOne({ _id: id });
            return result.deletedCount === 1;
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundUser = yield dbMongo_1.usersCollection.findOne({ _id: userId });
            if (foundUser) {
                return foundUser;
            }
            else {
                return null;
            }
        });
    },
    findLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.usersCollection.findOne({ $or: [{ email: loginOrEmail }, { userName: loginOrEmail }] });
        });
    }
};
