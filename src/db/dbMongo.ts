import {MongoClient, ObjectId} from 'mongodb';
import dotenv from 'dotenv'
import {BlogViewType} from '../types/blog-types';
import {PostViewModel} from '../types/post-types';
dotenv.config()



const url = process.env.MONGO_URL;
//const mongoURI = process.env.mongoURI || url;
if(!url){
    throw new Error('Url doesn`t found')
}
const client = new MongoClient(url);

const db = client.db();
export const blogsCollection = db.collection<BlogViewType>('blogs');
export const postsCollection = db.collection<PostViewModel>('posts');
export async function runDb() {
    try {
        await client.connect();
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Can`t connect to mongo server');
        await client.close();
    }

}
