import {MongoClient} from 'mongodb';
import dotenv from 'dotenv'
import {BlogDbType, BlogViewType} from '../types/blog-types';
import {PostDBModel, PostViewModel} from '../types/post-types';
import {UsersDBType} from '../types/user-types';
import {CommentsDBType} from '../types/comments-types';

dotenv.config()



const url = process.env.MONGO_URL;
//const mongoURI = process.env.mongoURI || url;
if(!url){
    throw new Error('Url doesn`t found')
}
const client = new MongoClient(url);

const db = client.db();
export const blogsCollection = db.collection<BlogDbType>('blogs');
export const postsCollection = db.collection<PostDBModel>('posts');
export const usersCollection = db.collection<UsersDBType>('users');
export const commentsCollection = db.collection<CommentsDBType>('comments');
export async function runDb() {
    try {
        await client.connect();
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Can`t connect to mongo server');
        await client.close();
    }

}
