import {MongoClient} from 'mongodb';
import dotenv from 'dotenv'
import {BlogDbType, BlogSchema} from '../types/blog-types';
import {PostDBModel, PostSchema} from '../types/post-types';
import {NewUsersDBType, UsersSchema} from '../types/user-types';
import {CommentsDBType, CommentsSchema} from "../types/comments-types";
import {
    DeviceDBModel,
    DeviceSchema,
    LoginAttemptDBModel,
    LoginAttemptSchema, RecoveryCodeDBModel,
    RecoveryCodeSchema
} from "../types/auth-types";
import mongoose from 'mongoose'
import {LikeStatusDBType, LikeStatusSchema} from "../types/likeStatus-types";


dotenv.config()


//const url = process.env.MONGO_URL;
const dbName = 'home_works'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;
if (!mongoURI) {
    throw new Error('Url doesn`t found')
}
const client = new MongoClient(mongoURI);

const db = client.db();

export const BlogModel = mongoose.model<BlogDbType>('blogs', BlogSchema)

export const PostModel = mongoose.model<PostDBModel>('posts', PostSchema);
export const UserModel = mongoose.model<NewUsersDBType>('users', UsersSchema);
export const CommentModel = mongoose.model<CommentsDBType>('comments', CommentsSchema);
//export const deviceCollection = db.collection<DeviceDBModel>('devices');
export const DeviceModel = mongoose.model<DeviceDBModel>('devices', DeviceSchema);
export const LoginAttemptModel = mongoose.model<LoginAttemptDBModel>('loginAttempt', LoginAttemptSchema);
export const RecoveryCodeModel = mongoose.model<RecoveryCodeDBModel>('recoveryCodes', RecoveryCodeSchema);
export const LikeStatusModel = mongoose.model<LikeStatusDBType>('likeStatuses', LikeStatusSchema);


export async function runDb() {
    try {
        await mongoose.connect(mongoURI)
        // await client.connect();
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Can`t connect to mongo server');
        await mongoose.disconnect()
    }

}
