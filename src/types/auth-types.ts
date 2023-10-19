import mongoose from "mongoose";

export type LoginSuccessViewModel = {
    accessToken: string
}
export type LoginSuccessViewModelForRefresh = {
    refreshToken: string
}

export type DeviceViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

export type DeviceViewModelArray = DeviceViewModel[]
// export type DeviceDBModel = {
//     userID: string,
//     ip: string,
//     title: string,
//     lastActiveDate: string
//     deviceId: string
// }
export type DeviceDBModel = {
    userId: string,
    issuedAt: number,
    expirationAt: number,
    deviceId: string,
    ip: string,
    deviceName: string,
}

export type deviceInputValue = {
    userId: string,
    deviceId: string,
    refreshToken: string,
    deviceName: string,
    ip: string
}

export type LoginAttemptDBModel = {
    ip: string,
    url: string,
    date: Date
}
export const DeviceSchema = new mongoose.Schema<DeviceDBModel>({
    userId: {type: String, require: true},
    issuedAt: {type: Number, require: true},
    expirationAt: {type: Number, require: true},
    deviceId: {type: String, require: true},
    ip: {type: String, require: true},
    deviceName: {type: String, require: true},
})

export const LoginAttemptSchema = new mongoose.Schema<LoginAttemptDBModel>({
    ip: {type: String, require: true},
    url: {type: String, require: true},
    date: {type: Date, default: Date.now()}
})

