import {getSessionsMapping} from '../../helpers/helpers';
import {DeviceModel, LoginAttemptModel} from '../../db/dbMongo';
import {DeviceViewModelArray} from "../../types/auth-types";

export const deviceQueryRepository = {

    async getAllDeviceSessions(userId: string): Promise<DeviceViewModelArray> {
        const sessions = await DeviceModel.find({userId: userId, issuedAt: {$ne: 0}}).lean()
        return sessions.map(session => getSessionsMapping(session))
    },

    async findUserIdByDeviceId(deviceId: string): Promise<String | null> {
        const foundDeviceInfo = await DeviceModel.findOne({deviceId: deviceId})
        if (foundDeviceInfo) {
            return foundDeviceInfo.userId
        }
        return null
    },
    async getLoginAtemptsByUrlAndIp(ip: string, url: string, date: Date) {
        return LoginAttemptModel.countDocuments({ip, url, date: {$gt: date}})
    }
}