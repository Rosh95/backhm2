import {NewUsersDBType} from '../types/user-types';
import jwt from 'jsonwebtoken';
import {settings} from '../settings';
import {ObjectId} from 'mongodb';
import {LoginSuccessViewModel, LoginSuccessViewModelForRefresh} from '../types/auth-types';

export const jwtService = {
    async createJWT(user: NewUsersDBType): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userID: user._id}, settings.JWT_SECRET, {expiresIn: '1000s'})
        return {
            accessToken: token
        }
    },
    async createRefreshJWT(user: NewUsersDBType, deviceId: string): Promise<LoginSuccessViewModelForRefresh> {
        const token = jwt.sign({
            userID: user._id,
            deviceID: deviceId
        }, settings.JWT_REFRESH_SECRET, {expiresIn: '2000s'})
        return {
            refreshToken: token
        }
    },
    async createDeviceJWT(user: NewUsersDBType, deviceId: string): Promise<LoginSuccessViewModelForRefresh> {
        const token = jwt.sign({userID: user._id, deviceID: deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: '20s'})
        return {
            refreshToken: token
        }
    },

    async getUserIdByAccessToken(token: string): Promise<ObjectId | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as { userID: string };
            console.log(result)
            return new ObjectId(result.userID)
        } catch (error) {
            return null
        }
    },
    async getUserIdByRefreshToken(token: string): Promise<ObjectId | null> {
        try {
            const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as { userID: string };
            console.log(result)

            return new ObjectId(result.userID)
        } catch (error) {
            return null
        }
    },

    async getTokenInfoByRefreshToken(token: string): Promise<any | null> {
        try {
            const result = jwt.verify(token, settings.JWT_REFRESH_SECRET) as {
                userID: string,
                deviceId: string,
                iat: number,
                exp: number
            };
            return result
        } catch (error) {
            return null
        }
    }

}