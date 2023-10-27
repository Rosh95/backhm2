import {NewUsersDBType, UserViewModel} from '../../types/user-types';
import {DeviceModel, RecoveryCodeModel, UserModel} from '../../db/dbMongo';
import {usersMapping} from '../../helpers/helpers';
import {ObjectId} from 'mongodb';
import {DeviceDBModel} from "../../types/auth-types";
import {FilterQuery} from "mongoose";

export const authRepository = {

    async getAllUsers() {
        return UserModel.find().sort({'createdAt': -1}).lean();
    },
    async createUser(newUser: NewUsersDBType): Promise<UserViewModel> {

        const result = await UserModel.create(newUser);
        return usersMapping(newUser);
    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        const result = await UserModel.deleteOne({_id: id});
        return result.deletedCount === 1;
    },
    async findUserById(userId: string): Promise<NewUsersDBType | null> {
        let foundUser: NewUsersDBType | null = await UserModel.findOne({_id: new ObjectId(userId)});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findUserByLogin(login: string): Promise<NewUsersDBType | null> {
        let foundUser = await UserModel.findOne({"accountData.login": login});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findUserByEmail(email: string): Promise<NewUsersDBType | null> {
        let foundUser = await UserModel.findOne({"accountData.email": email});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findUserByCode(code: string): Promise<NewUsersDBType | null> {
        let foundUser = await UserModel.findOne({"emailConfirmation.confirmationCode": code});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async findLoginOrEmail(loginOrEmail: string): Promise<NewUsersDBType | null> {
        return UserModel.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]});
    },
    async updateEmailConfimation(userId: ObjectId): Promise<boolean> {
        const result = await UserModel.updateOne({_id: new ObjectId(userId)}, {
            $set: {
                "emailConfirmation.isConfirmed": true
            }
        })
        return result.matchedCount === 1;
    },
    async updateUserPassword(email: string, passwordHash: string, passwordSalt: string): Promise<boolean> {
        const result = await UserModel.findOneAndUpdate({"accountData.email": email}, {
            $set: {
                "accountData.passwordHash": passwordHash,
                "accountData.passwordSalt": passwordSalt
            }
        })
        return true;
    },
    async updateRecoveryCode(email: string, recoveryCode: string): Promise<ObjectId | null> {
        const result = await RecoveryCodeModel.findOneAndUpdate({email}, {
            $set: {recoveryCode}
        }, {returnDocument: 'after'})

        return result ? result._id : null;
    },
    async addRecoveryCodeAndEmail(email: string, recoveryCode: string): Promise<ObjectId> {
        const result = await RecoveryCodeModel.create({email, recoveryCode})
        return result._id
    },

    async findEmailByRecoveryCode(recoveryCode: string): Promise<string | null> {
        const result = await RecoveryCodeModel.findOne({recoveryCode})
        return result ? result.email : null
    },

    async createOrUpdateRefreshToken(refreshTokenInfo: DeviceDBModel): Promise<Boolean> {
        const filter: FilterQuery<DeviceDBModel> = {
            userId: refreshTokenInfo.userId,
            deviceId: refreshTokenInfo.deviceId
        }
        const findUserInRefreshCollection = await DeviceModel.findOne(filter)
        if (findUserInRefreshCollection) {
            const newRefreshToken = await DeviceModel.updateOne(filter, {
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
                await DeviceModel.create(refreshTokenInfo);
                return true;
            } catch (e) {
                return false;
            }
        }
    }


}