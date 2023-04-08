import {countTotalUsersAndPages, queryDataType, usersMapping} from '../../helpers/helpers';
import {usersCollection} from '../../db/dbMongo';
import {PaginatorUserViewType, UsersDBType, UserViewModel} from '../../types/user-types';
import {Filter} from 'mongodb';

export const usersQueryRepository = {
    async getAllUsers(queryData: queryDataType): Promise<PaginatorUserViewType> {

        const filter: Filter<UsersDBType> = {
            $and: [{
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
        }

        const users = await usersCollection.find(filter)
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();

        let usersViewArray: UserViewModel[] = users.map(user => usersMapping(user))
        let pagesCount = await countTotalUsersAndPages(queryData, filter);

        return {
            pagesCount: pagesCount.usersPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.usersTotalCount,
            items: usersViewArray
        };
    },

    async getAllUsersCount(filter?: Filter<any>): Promise<number> {

        return await usersCollection.countDocuments(filter);
    },
}