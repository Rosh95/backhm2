import {devicesCollection, loginAttemptCollection} from '../../db/dbMongo';

export const deviceRepository = {

    async deleteOtherUserDevice(userId: string, currentDeviceId: string): Promise<boolean> {
        const result = await devicesCollection.deleteMany(
            {
                $and: [{userId: userId}, {deviceId: {$ne: currentDeviceId}}]
            }
        )
        return result.deletedCount >= 1;
    },
    async deleteUserDeviceById(deviceId: string): Promise<boolean> {
        const result = await devicesCollection.deleteOne({deviceId: deviceId});
        return result.deletedCount === 1;
    },

    async updateIssuedDate(userId: string, deviceId: string): Promise<boolean> {
        const result = await devicesCollection.updateOne({userId: userId, deviceId: deviceId}, {
            $set: {
                issuedAt: 0,
                expirationAt: 0
            }
        })
        return result.matchedCount === 1;
    },
    async createLoginAtempt(ip: string, url: string, date: Date) {
        return loginAttemptCollection.insertOne({ip, url, date})
    }


}