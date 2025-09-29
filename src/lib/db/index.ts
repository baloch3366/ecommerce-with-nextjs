import mongoose, { Mongoose } from "mongoose"

interface Cached {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

// 👇 Safely add mongoose to globalThis for hot-reload in Next.js
declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined
}

const cached: Cached = global.mongoose || { conn: null, promise: null }

export const ConnectToDatabase = async (DB_URL = process.env.DB_URL) => {
  if (cached.conn) return cached.conn

  if (!DB_URL) throw new Error("Database URL is missing")

  cached.promise = cached.promise || mongoose.connect(DB_URL)

  cached.conn = await cached.promise
  global.mongoose = cached

  console.log("✅ MongoDB Connected")
  return cached.conn
}
