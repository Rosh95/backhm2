import {MongoClient} from 'mongodb';
import dotenv from 'dotenv'
import {BlogDbType} from '../types/blog-types';
import {PostDBModel} from '../types/post-types';
import {NewUsersDBType} from '../types/user-types';
import {CommentsDBType} from "../types/comments-types";
import {DeviceDBModel} from "../types/auth-types";

dotenv.config()


const url = process.env.MONGO_URL;
//const mongoURI = process.env.mongoURI || url;
if (!url) {
    throw new Error('Url doesn`t found')
}
const client = new MongoClient(url);

const db = client.db();
export const blogsCollection = db.collection<BlogDbType>('blogs');
export const postsCollection = db.collection<PostDBModel>('posts');
export const usersCollection = db.collection<NewUsersDBType>('users');
export const commentsCollection = db.collection<CommentsDBType>('comments');
//export const deviceCollection = db.collection<DeviceDBModel>('devices');
export const devicesCollection = db.collection<DeviceDBModel>('devices');


export async function runDb() {
    try {
        await client.connect();
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Can`t connect to mongo server');
        await client.close();
    }

}
