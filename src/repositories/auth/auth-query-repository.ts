import {countTotalUsersAndPages, queryDataType, usersMapping} from '../../helpers/helpers';
import {UserModel} from '../../db/dbMongo';
import {NewUsersDBType, PaginatorUserViewType, UserViewModel} from '../../types/user-types';
import {Filter} from 'mongodb';

export const authQueryRepository = {
    async getAllUsers(queryData: queryDataType): Promise<PaginatorUserViewType> {

        const filter: Filter<NewUsersDBType> = {
            $or: [{
                email: {
                    $regex: queryData.searchEmailTerm,
                    $options: 'i'
                }
            }, {
                login: {
                    $regex: queryData.searchLoginTerm,
                    $options: 'i'
                }
            }]
        }
        // @ts-ignore
        const users = await UserModel.find(filter)
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize)
            .lean();

        let usersViewArray: UserViewModel[] = users.map(user => usersMapping(user))
        let pagesCount = await countTotalUsersAndPages(queryData, filter);

        return {
            pagesCount: pagesCount.usersPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.usersTotalCount,
            items: usersViewArray
        };
    }
}