import {getUserViewModel, NewUsersDBType} from '../../types/user-types';
import {UserModel} from '../../db/dbMongo';
import {getUsersMapping} from '../../helpers/helpers';
import {ObjectId} from 'mongodb';


export class UserRepository {
    async getAllUsers() {
        return UserModel.find().sort({'createdAt': -1}).lean();
    }
    async createUser(newUser: NewUsersDBType): Promise<getUserViewModel> {
        await UserModel.create(newUser);
        return getUsersMapping(newUser);
    }
    async deleteUser(id: ObjectId): Promise<boolean> {
        const result = await UserModel.deleteOne({_id: id});
        return result.deletedCount === 1;
    }
    async findUserById(userId: string): Promise<NewUsersDBType | null> {
        let foundUser: NewUsersDBType | null = await UserModel.findById(userId);
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    }
    async findUserByLogin(login: string): Promise<NewUsersDBType | null> {
        let foundUser = await UserModel.findOne({"accountData.login": login});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    }
    async findUserByEmail(email: string): Promise<NewUsersDBType | null> {
        let foundUser = await UserModel.findOne({"accountData.email": email});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    }
    async findUserByCode(code: string): Promise<NewUsersDBType | null> {
        let foundUser = await UserModel.findOne({"emailConfirmation.confirmationCode": code});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    }
    async findLoginOrEmail(loginOrEmail: string): Promise<NewUsersDBType | null> {
        return UserModel.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]});
    }
    async updateConfirmationCode(userId: ObjectId, code: string): Promise<boolean> {

        const result = await UserModel.findByIdAndUpdate(userId, {
            $set: {
                "emailConfirmation.confirmationCode": code
            }
        }, {new: true})

        return true
    }
}
export const userRepository = new UserRepository()