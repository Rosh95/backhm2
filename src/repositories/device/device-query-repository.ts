import {getSessionsMapping} from '../../helpers/helpers';
import {devicesCollection} from '../../db/dbMongo';
import {DeviceViewModelArray} from "../../types/auth-types";

export const deviceQueryRepository = {

    async getAllDeviceSessions(userId: string): Promise<DeviceViewModelArray> {

        const sessions = await devicesCollection.find({userId: userId}).toArray()

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


}