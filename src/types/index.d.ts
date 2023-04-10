import {UsersDBType} from './user-types';


declare global {
    declare namespace Express {
        export interface Request {
            user: UsersDBType | null
        }
    }
}