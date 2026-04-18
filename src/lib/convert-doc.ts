import { Document, Types } from "mongoose"

export function convertDoc<T>(
  doc: Document & { _id: Types.ObjectId | string }
): T {
  const obj = doc.toObject?.() ?? doc

  return {
    ...obj,
    _id: doc._id.toString(),
  } as T
}