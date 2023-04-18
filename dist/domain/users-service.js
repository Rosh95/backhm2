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
exports.userService = void 0;
const user_repository_1 = require("../repositories/user/user-repository");
const mongodb_1 = require("mongodb");
const email_adapter_1 = require("../adapters/email-adapter");
const add_1 = __importDefault(require("date-fns/add"));
const uuid_1 = require("uuid");
const bcrypt = require('bcrypt');
exports.userService = {
    createUser(userPostInputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt.genSalt(10);
            const passwordHash = yield this._generateHash(userPostInputData.password, passwordSalt);
            let newUser = {
                _id: new mongodb_1.ObjectId(),
                accountData: {
                    login: userPostInputData.login,
                    email: userPostInputData.email,
                    passwordHash,
                    passwordSalt,
                    createdAt: new Date()
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    emailExpiration: (0, add_1.default)(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: false,
                }
            };
            const createdUser = yield user_repository_1.userRepository.createUser(newUser);
            try {
                yield email_adapter_1.emailAdapter.sendConfirmationEmail(createdUser.emailConfirmation.confirmationCode, createdUser.email);
            }
            catch (e) {
                return null;
            }
            return createdUser;
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
            console.log(user + ' in find');
            if (!user)
                return false;
            const passwordHash = yield this._generateHash(password, user.accountData.passwordSalt);
            if (user.accountData.passwordHash === passwordHash) {
                return user;
            }
            else
                return false;
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_repository_1.userRepository.findUserById(userId);
        });
    },
    findUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_repository_1.userRepository.findUserByLogin(login);
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.hash(password, salt);
        });
    }
};
