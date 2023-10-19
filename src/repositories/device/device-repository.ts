import {DeviceModel, LoginAttemptModel} from '../../db/dbMongo';

export const deviceRepository = {

    async deleteOtherUserDevice(userId: string, currentDeviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteMany(
            {
                $and: [{userId: userId}, {deviceId: {$ne: currentDeviceId}}]
            }
        )
        return result.deletedCount >= 1;
    },
    async deleteUserDeviceById(deviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteOne({deviceId: deviceId});
        return result.deletedCount === 1;
    },

    async updateIssuedDate(userId: string, deviceId: string): Promise<boolean> {
        const result = await DeviceModel.updateOne({userId: userId, deviceId: deviceId}, {
            $set: {
                issuedAt: 0,
                expirationAt: 0
            }
        })
        return result.matchedCount === 1;
    },
    async createLoginAtempt(ip: string, url: string, date: Date) {
        return LoginAttemptModel.create({ip, url, date})
    }


}