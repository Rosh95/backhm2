import {getSessionsMapping} from '../../helpers/helpers';
import {devicesCollection, loginAttemptCollection} from '../../db/dbMongo';
import {DeviceViewModelArray} from "../../types/auth-types";

export const deviceQueryRepository = {

    async getAllDeviceSessions(userId: string): Promise<DeviceViewModelArray> {

        const sessions = await devicesCollection.find({userId: userId, issuedAt: {$ne: 0}}).toArray()

        const sessionsViewArray: DeviceViewModelArray = sessions.map(session => getSessionsMapping(session))

        return sessionsViewArray
    },

    async findUserIdByDeviceId(deviceId: string): Promise<String | null> {

        const foundDeviceInfo = await devicesCollection.findOne({deviceId: deviceId})

        if (foundDeviceInfo) {
            return foundDeviceInfo.userId
        }
        return null

    },
    async getDeviceIdByUserId(userId: string): Promise<string | null> {

        const foundDeviceInfo = await devicesCollection.findOne({userId: userId})

        if (foundDeviceInfo) {
            return foundDeviceInfo.deviceId
        }
        return null
    },

    async getLoginAtemptsByUrlAndIp(ip: string, url: string, date: Date) {
        const resultCount = await loginAttemptCollection.find({ip, url, date: {$gt: date}}).toArray()
        return resultCount.length
    }
}