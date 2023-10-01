import {getUserViewModel, NewUsersDBType, UserInputType, UserViewModel} from '../types/user-types';
import {userRepository} from '../repositories/user/user-repository';
import {ObjectId} from 'mongodb';
import {emailAdapter} from '../adapters/email-adapter';
import add from 'date-fns/add';
import {v4 as uuidv4} from 'uuid';

const bcrypt = require('bcrypt');

export const userService = {

    async createUser(userPostInputData: UserInputType): Promise<getUserViewModel | null> {

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(userPostInputData.password, passwordSalt)

        let newUser: NewUsersDBType = {
            _id: new ObjectId(),
            accountData: {
                login: userPostInputData.login,
                email: userPostInputData.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                emailExpiration: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: true,
            }
        }
        const createdUser = await userRepository.createUser(newUser);
        // try {
        //     await emailAdapter.sendConfirmationEmail(createdUser.emailConfirmation.confirmationCode, createdUser.email)
        // } catch (e) {
        //     return null
        // }
        return createdUser
    },
    async changeUserConfirmationcode(email: string): Promise<NewUsersDBType | null> {

        const currentUser = await userService.findUserByEmail(email);
        const newConfirmationCode = uuidv4();
        if (currentUser) {
            try {
                await userRepository.updateConfirmationCode(currentUser._id, newConfirmationCode);
            } catch (e) {
                console.log(e)
                return null
            }
        }
        return await userRepository.findUserByEmail(email);

    },

    async deleteUser(id: string): Promise<boolean> {
        let idInMongo = new ObjectId(id)
        return await userRepository.deleteUser(idInMongo);
    },
    async checkCredential(loginOrEmail: string, password: string) {
        const user = await userRepository.findLoginOrEmail(loginOrEmail);
        if (!user) return false;
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash === passwordHash) {
            return user;
        } else return false


    },

    async findUserById(userId: string): Promise<NewUsersDBType | null> {
        return await userRepository.findUserById(userId)
    },
    async findUserByLogin(login: string): Promise<NewUsersDBType | null> {
        return await userRepository.findUserByLogin(login)
    },
    async findUserByEmail(email: string): Promise<NewUsersDBType | null> {
        return await userRepository.findUserByEmail(email)
    },
    async findUserByCode(code: string): Promise<NewUsersDBType | null> {
        return await userRepository.findUserByCode(code)
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}