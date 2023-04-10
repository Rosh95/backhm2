import {UsersDBType, UserViewModel} from '../types/user-types';
import {userRepository} from '../repositories/user/user-repository';
import {ObjectId} from 'mongodb';
import {usersCollection} from '../db/dbMongo';

const bcrypt = require('bcrypt');

export const userService = {

    async createUser(login: string, email: string, password: string): Promise<UserViewModel> {

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        let newUser: UsersDBType = {
            _id: new ObjectId(),
            login: login,
            email: email,
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
    async findUserById(userId: ObjectId) {
        let foundUser = await usersCollection.findOne({_id: userId});
        if (foundUser) {
            return foundUser
        } else {
            return null;
        }
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}