import {UserInputType, UsersDBType, UserViewModel} from '../types/user-types';
import {userRepository} from '../repositories/user/user-repository';
import {ObjectId} from 'mongodb';

const bcrypt = require('bcrypt');

export const userService = {

    async createUser(userPostInputData: UserInputType): Promise<UserViewModel> {

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(userPostInputData.password, passwordSalt)

        let newUser: UsersDBType = {
            _id: new ObjectId(),
            login: userPostInputData.login,
            email: userPostInputData.email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }
        return await userRepository.createUser(newUser);

    },
    async deleteUser(id: string): Promise<boolean> {
        let idInMongo = new ObjectId(id)
        return await userRepository.deleteUser(idInMongo);
    },
    async checkCredential(loginOrEmail: string, password: string) {
        const user = await userRepository.findLoginOrEmail(loginOrEmail);
        console.log(user + ' in find')
        if (!user) return false;
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return user;
        } else return false


    },
    async findUserById(userId: string): Promise<UsersDBType | null> {
        return await userRepository.findUserById(userId)

    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}