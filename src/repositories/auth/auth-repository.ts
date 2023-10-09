import {NewUsersDBType, UserViewModel} from '../../types/user-types';
import {devicesCollection, usersCollection} from '../../db/dbMongo';
import {usersMapping} from '../../helpers/helpers';
import {Filter, ObjectId} from 'mongodb';
import {DeviceDBModel} from "../../types/auth-types";

export const authRepository = {

    async getAllUsers() {
        return await usersCollection.find().sort({'createdAt': -1}).toArray();
    },
    async createUser(newUser: NewUsersDBType): Promise<UserViewModel> {

        const result = await usersCollection.insertOne(newUser);
        return usersMapping(newUser);
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
    async updateEmailConfimation(userId: ObjectId): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: new ObjectId(userId)}, {
            $set: {
                "emailConfirmation.isConfirmed": true
            }
        })
        return result.matchedCount === 1;
    },
    async createOrUpdateRefreshToken(refreshTokenInfo: DeviceDBModel): Promise<any> {
        const filter: Filter<DeviceDBModel> = {
            userId: refreshTokenInfo.userId,
            deviceName: refreshTokenInfo.deviceName
        }
        const findUserInRefreshCollection = await devicesCollection.findOne(filter)

        if (findUserInRefreshCollection) {
            const newRefreshToken = await devicesCollection.updateOne(filter, {
                $set: {
                    issuedAt: refreshTokenInfo.issuedAt,
                    expirationAt: refreshTokenInfo.expirationAt,
                    ip: refreshTokenInfo.ip,
                    deviceName: refreshTokenInfo.deviceName,
                }
            })
            return newRefreshToken.matchedCount === 1;
        } else {
            try {
                const result = await devicesCollection.insertOne(refreshTokenInfo);
                return true;
            } catch (e) {
                return false;
            }
        }
    }


}