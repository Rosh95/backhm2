import {Request, Response, Router} from 'express';
import {deviceQueryRepository} from "../repositories/device/device-query-repository";
import {jwtService} from "../application/jwt-service";
import {checkRefreshTokenMiddleware} from "../validation/auth-validation-middleware";
import {deviceRepository} from "../repositories/device/device-repository";


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
                return res.sendStatus(404)

            }
        }
        return res.sendStatus(404)
    });
deviceRouter.delete('/:deviceId',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await jwtService.getTokenInfoByRefreshToken(refreshToken);
        const findUserIdByDeviceId = await deviceQueryRepository.findUserIdByDeviceId(req.params.deviceId)
        if (!findUserIdByDeviceId) {
            return res.sendStatus(404)
        }
        if (currentUserInfo) {
            const currentDeviceId = currentUserInfo.deviceID;
            const currentUserId = currentUserInfo.userID;
            if (findUserIdByDeviceId !== currentUserId) {
                return res.sendStatus(403)
            }
            try {
                const isDeleted: boolean = await deviceRepository.deleteUserDeviceById(currentDeviceId);
                if (isDeleted) {
                    return res.sendStatus(204)
                }
                return res.sendStatus(404)
            } catch (e) {
                return res.sendStatus(404)
            }
        }
        return res.sendStatus(404)
    });
deviceRouter.delete('/',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        console.log('hello!!!!!!!!!!!!!!!!')

        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (currentUserInfo) {
            const currentDeviceId = currentUserInfo.deviceID;
            const currentUserId = currentUserInfo.userID;
            try {
                const isDeleted: boolean = await deviceRepository.deleteOtherUserDevice(currentUserId, currentDeviceId);
                if (isDeleted) {
                    return res.sendStatus(204)
                }
                return res.sendStatus(404)
            } catch (e) {
                return res.sendStatus(404)
            }
        }
        return res.sendStatus(404)
    })