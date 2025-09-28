import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.DB_URL){
    throw new Error('Invalid/Missing environment variable: "DATABASE_URL"')
}

const Uri = process.env.DB_URL;
const options = {
    serverApi: {
     version: ServerApiVersion.v1,
     strict: true,
     deprecationErrors: true,
    },
}

 let client: MongoClient;

 if(process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis &{
        _MongoClient?: MongoClient
    }
    if(!globalWithMongo._MongoClient) {
        globalWithMongo._MongoClient = new MongoClient(Uri,options)
    }
    client = globalWithMongo._MongoClient // in development with cathed(global) avoid duplicate
 }else{
    client = new MongoClient(Uri,options) // obj in production no catched
 }

 export default client