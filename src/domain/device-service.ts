import {deviceRepository} from "../repositories/device/device-repository";
import {deviceQueryRepository} from "../repositories/device/device-query-repository";
import {UserAndDeviceTypeFromRefreshToken} from "../types/jwt-types";

export enum ResultCode {
    Success = 0,
    NotFound,
    BadRequest,
    Forbidden,
    DeviceNotFound,
    ServerError,
    NoContent
}

export type ResultObject<T> = {
    data: T | null
    resultCode: ResultCode
    errorMessage?: string
}

export const deviceService = {
    async deleteOtherUserDevice(userId: string, deviceId: string): Promise<boolean> {
        return await deviceRepository.deleteOtherUserDevice(userId, deviceId);
    },

    async deleteUserDeviceById(currentUserInfo: UserAndDeviceTypeFromRefreshToken, currentDeviceId: string): Promise<ResultObject<boolean>> {
        const findUserIdByDeviceId = await deviceQueryRepository.findUserIdByDeviceId(currentDeviceId);
        if (!findUserIdByDeviceId) {
            return {
                data: null,
                resultCode: ResultCode.NotFound,
                errorMessage: 'user not found'
            }
        }

        if (currentDeviceId === currentUserInfo.deviceId) {
            return {
                data: null,
                resultCode: ResultCode.BadRequest,
                errorMessage: 'cant delete current device'
            }
        }
        if (findUserIdByDeviceId !== currentUserInfo.userId) {
            return {
                data: null,
                resultCode: ResultCode.Forbidden,
                errorMessage: 'cant delete another device id'
            }
        }

        const isDeleted: boolean = await deviceRepository.deleteUserDeviceById(currentDeviceId);
        if (isDeleted) {
            return {
                data: true,
                resultCode: ResultCode.Success,
                errorMessage: ''
            }
        }

        return {
            data: null,
            resultCode: ResultCode.ServerError,
            errorMessage: 'server error'
        }
    },
}