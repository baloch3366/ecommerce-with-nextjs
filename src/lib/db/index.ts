

import mongoose from "mongoose";

const catched = (global as any).mongoose || {conn: null, promise:null};

export const ConnectToDatabase = async(DB_URL = process.env.DB_URL) => {
    if(catched.conn) return catched.conn;

    if(!DB_URL) throw new Error('Database-url is missing');
    catched.promise = catched.promise || mongoose.connect(DB_URL);
    
    catched.conn = await catched.promise;
    // console.log(catched)

    console.log("connection success")
    return catched.conn;
}