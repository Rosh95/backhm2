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
exports.usersQueryRepository = void 0;
const helpers_1 = require("../../helpers/helpers");
const dbMongo_1 = require("../../db/dbMongo");
exports.usersQueryRepository = {
    getAllUsers(queryData) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                $or: [{
                        'accountData.email': {
                            $regex: (_a = queryData.searchEmailTerm) !== null && _a !== void 0 ? _a : '',
                            $options: 'i'
                        }
                    }, {
                        'accountData.login': {
                            $regex: (_b = queryData.searchLoginTerm) !== null && _b !== void 0 ? _b : '',
                            $options: 'i'
                        }
                    }]
            };
            const users = yield dbMongo_1.usersCollection.find(filter)
                .sort({ [queryData.sortBy]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize)
                .toArray();
            let usersViewArray = users.map(user => (0, helpers_1.getUsersMapping)(user));
            let pagesCount = yield (0, helpers_1.countTotalUsersAndPages)(queryData, filter);
            return {
                pagesCount: pagesCount.usersPagesCount,
                page: queryData.pageNumber,
                pageSize: queryData.pageSize,
                totalCount: pagesCount.usersTotalCount,
                items: usersViewArray
            };
        });
    },
    getAllUsersCount(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbMongo_1.usersCollection.countDocuments(filter);
        });
    },
};
