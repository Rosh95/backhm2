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
exports.userService = void 0;
const user_repository_1 = require("../repositories/user/user-repository");
const mongodb_1 = require("mongodb");
const dbMongo_1 = require("../db/dbMongo");
const bcrypt = require('bcrypt');
exports.userService = {
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            let newUser = {
                _id: new mongodb_1.ObjectId(),
                userName: login,
                email: email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            };
            return yield user_repository_1.userRepository.createBlog(newUser);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let idInMongo = new mongodb_1.ObjectId(id);
            return yield user_repository_1.userRepository.deleteUser(idInMongo);
        });
    },
    checkCredential(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.userRepository.findLoginOrEmail(loginOrEmail);
            if (!user)
                return false;
            const passwordHash = yield this._generateHash(password, user.passwordSalt);
            return user.passwordHash === passwordHash;
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
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.hash(password, salt);
        });
    }
};