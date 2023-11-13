import {countTotalUsersAndPages, getUsersMapping, queryDataType} from '../../helpers/helpers';
import {UserModel} from '../../db/dbMongo';
import {getUserViewModel, NewUsersDBType, PaginatorUserViewType} from '../../types/user-types';
import {FilterQuery} from "mongoose";

export class  UsersQueryRepository {
    async getAllUsers(queryData: queryDataType): Promise<PaginatorUserViewType> {

        const filter: FilterQuery<NewUsersDBType> = {
            $or: [{
                'accountData.email': {
                    $regex: queryData.searchEmailTerm ?? '',
                    $options: 'i'
                }
            }, {
                'accountData.login': {
                    $regex: queryData.searchLoginTerm ?? '',
                    $options: 'i'
                }
            }]
        }

        const users = await UserModel.find(filter)
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize)
            .lean();

        let usersViewArray: getUserViewModel[] = users.map(user => getUsersMapping(user))
        let pagesCount = await countTotalUsersAndPages(queryData, filter);

        return {
            pagesCount: pagesCount.usersPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.usersTotalCount,
            items: usersViewArray
        };
    }

    async getAllUsersCount(filter?: FilterQuery<any>): Promise<number> {
        return filter ? UserModel.countDocuments(filter) : UserModel.countDocuments()
    }
}
export const usersQueryRepository = new UsersQueryRepository()