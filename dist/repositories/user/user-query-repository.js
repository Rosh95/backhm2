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
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                $or: [{
                        email: {
                            $regex: queryData.searchEmailTerm,
                            $options: 'i'
                        }
                    }, {
                        userName: {
                            $regex: queryData.searchLoginTerm,
                            $options: 'i'
                        }
                    }]
            };
            const users = yield dbMongo_1.usersCollection.find(filter)
                .sort({ [queryData.sortByProp]: queryData.sortDirection })
                .skip(queryData.skippedPages)
                .limit(queryData.pageSize).toArray();
            let usersViewArray = users.map(user => (0, helpers_1.usersMapping)(user));
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
