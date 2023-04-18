import {NewUsersDBType} from '../types/user-types';
import jwt from 'jsonwebtoken';
import {settings} from '../settings';
import {ObjectId} from 'mongodb';
import {LoginSuccessViewModel} from '../types/auth-types';

export const jwtService = {
    async createJWT(user: NewUsersDBType): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userID: user._id}, settings.JWT_SECRET, {expiresIn: "1h"})
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as { userID: string };
            return new ObjectId(result.userID)
        } catch (error) {
            return null
        }
    }
}