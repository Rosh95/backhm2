import {UsersDBType} from '../types/user-types';
import jwt from 'jsonwebtoken';
import {settings} from '../settings';
import {ObjectId} from 'mongodb';
import {LoginSuccessViewModel} from '../types/auth-types';

export const jwtService = {
    async createJWT(user: UsersDBType): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userID: user._id}, settings.JWT_SECRET, {expiresIn: "1h"})
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}