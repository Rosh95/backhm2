import {authService} from "./auth-service";

export const deviceService = {
    async changeIssuedDate(userId: string): Promise<any> {
        const findUserByUserId = await authService.findUserById(userId)
    },

}