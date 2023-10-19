import {Request, Response, Router} from 'express';
import {deviceQueryRepository} from "../repositories/device/device-query-repository";
import {jwtService} from "../application/jwt-service";
import {checkRefreshTokenMiddleware} from "../validation/auth-validation-middleware";
import {deviceService, ResultCode} from "../domain/device-service";

export const deviceRouter = Router({});

deviceRouter.get('/',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const currentUserId = await jwtService.getUserIdByRefreshToken(refreshToken);
        if (currentUserId) {
            try {
                const currentSessions = await deviceQueryRepository.getAllDeviceSessions(currentUserId.toString());
                return res.status(200).send(currentSessions)
            } catch (e) {
                return res.sendStatus(400)
            }
        }
        return res.sendStatus(400)
    });

deviceRouter.delete('/',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (currentUserInfo) {
            const currentDeviceId = currentUserInfo.deviceId;
            const currentUserId = currentUserInfo.userId;
            try {
                const isDeleted: boolean = await deviceService.deleteOtherUserDevice(currentUserId, currentDeviceId);
                if (isDeleted) {
                    return res.sendStatus(204)
                }
                return res.sendStatus(400)
            } catch (e) {
                return res.sendStatus(400)
            }
        }
        return res.sendStatus(400)
    })
deviceRouter.delete('/:deviceId',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        if (!req.params.deviceId) {
            return res.sendStatus(404)
        }
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (!currentUserInfo) {
            return res.sendStatus(400)
        }
        const result = await deviceService.deleteUserDeviceById(currentUserInfo, req.params.deviceId)
        if (result.resultCode !== ResultCode.Success) {
            return res.status(mapStatus(result.resultCode)).send(result.errorMessage)
        }
        return res.sendStatus(204)
    });

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