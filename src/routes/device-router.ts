import {Request, Response, Router} from 'express';
import {deviceQueryRepository, DeviceQueryRepository} from "../repositories/device/device-query-repository";
import {jwtService, JwtService} from "../application/jwt-service";
import {checkRefreshTokenMiddleware} from "../validation/auth-validation-middleware";
import {deviceService, DeviceService, ResultCode} from "../domain/device-service";

export const deviceRouter = Router({});


export class DeviceController {
    constructor(
        public deviceService: DeviceService,
        public deviceQueryRepository: DeviceQueryRepository,
        public jwtService: JwtService) {
    }

    async getDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const currentUserId = await this.jwtService.getUserIdByRefreshToken(refreshToken);
        if (currentUserId) {
            try {
                const currentSessions = await this.deviceQueryRepository.getAllDeviceSessions(currentUserId.toString());
                return res.status(200).send(currentSessions)
            } catch (e) {
                return res.sendStatus(400)
            }
        }
        return res.sendStatus(400)
    }

    async deleteDevice(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await this.jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (currentUserInfo) {
            const currentDeviceId = currentUserInfo.deviceId;
            const currentUserId = currentUserInfo.userId;
            try {
                const isDeleted: boolean = await this.deviceService.deleteOtherUserDevice(currentUserId, currentDeviceId);
                if (isDeleted) {
                    return res.sendStatus(204)
                }
                return res.sendStatus(400)
            } catch (e) {
                return res.sendStatus(400)
            }
        }
        return res.sendStatus(400)
    }

    async deleteDeviceByid(req: Request, res: Response) {
        if (!req.params.deviceId) {
            return res.sendStatus(404)
        }
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await this.jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (!currentUserInfo) {
            return res.sendStatus(400)
        }
        const result = await this.deviceService.deleteUserDeviceById(currentUserInfo, req.params.deviceId)
        if (result.resultCode !== ResultCode.Success) {
            return res.status(mapStatus(result.resultCode)).send(result.errorMessage)
        }
        return res.sendStatus(204)
    }

}

export const deviceController = new DeviceController(deviceService, deviceQueryRepository, jwtService)

deviceRouter.get('/',
    checkRefreshTokenMiddleware, deviceController.getDevices.bind(deviceController));

deviceRouter.delete('/',
    checkRefreshTokenMiddleware, deviceController.deleteDevice.bind(deviceController))
deviceRouter.delete('/:deviceId',
    checkRefreshTokenMiddleware, deviceController.deleteDeviceByid.bind(deviceController));

const mapStatus = (resultCode: ResultCode) => {
    switch (resultCode) {
        case ResultCode.BadRequest:
            return 400
        case ResultCode.DeviceNotFound:
            return 404
        case ResultCode.Forbidden:
            return 403
        case ResultCode.Success:
            return 200
        case ResultCode.NotFound:
            return 404
        case ResultCode.ServerError:
            return 500
        default:
            return 418
    }
}