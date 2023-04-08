import {UsersDBType, UserViewModel} from '../../types/user-types';
import {usersCollection} from '../../db/dbMongo';
import {usersMapping} from '../../helpers/helpers';
import {ObjectId} from 'mongodb';

export const userRepository = {

    async getAllUsers() {
        return await usersCollection.find().sort({'createdAt': -1}).toArray();
    },
    async createUser(newUser: UsersDBType): Promise<UserViewModel> {

        const result = await usersCollection.insertOne(newUser);
        return usersMapping(newUser);
    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: id});
        return result.deletedCount === 1;
    },
    async findUserById(userId: ObjectId) {
        let foundUser = await usersCollection.findOne({_id: userId});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]});
    }
}