import {devicesCollection} from '../../db/dbMongo';

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


}