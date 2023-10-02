import {getUserViewModel, NewUsersDBType} from '../../types/user-types';
import {usersCollection} from '../../db/dbMongo';
import {getUsersMapping} from '../../helpers/helpers';
import {ObjectId} from 'mongodb';

export const userRepository = {

    async getAllUsers() {
        return await usersCollection.find().sort({'createdAt': -1}).toArray();
    },
    async createUser(newUser: NewUsersDBType): Promise<getUserViewModel> {
        await usersCollection.insertOne(newUser);
        return getUsersMapping(newUser);
    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: id});
        return result.deletedCount === 1;
    },
    async findUserById(userId: string): Promise<NewUsersDBType | null> {
        let foundUser: NewUsersDBType | null = await usersCollection.findOne({_id: new ObjectId(userId)});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findUserByLogin(login: string): Promise<NewUsersDBType | null> {
        let foundUser = await usersCollection.findOne({"accountData.login": login});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findUserByEmail(email: string): Promise<NewUsersDBType | null> {
        let foundUser = await usersCollection.findOne({"accountData.email": email});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findUserByCode(code: string): Promise<NewUsersDBType | null> {
        let foundUser = await usersCollection.findOne({"emailConfirmation.confirmationCode": code});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findLoginOrEmail(loginOrEmail: string): Promise<NewUsersDBType | null> {
        return await usersCollection.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]});
    },
    async updateConfirmationCode(userId: ObjectId, code: string): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: new ObjectId(userId)}, {
            $set: {
                "emailConfirmation.confirmationCode": code
            }
        })
        return result.matchedCount === 1;
    }

}