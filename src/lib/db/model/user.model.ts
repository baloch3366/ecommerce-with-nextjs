import { IUserField } from "@/types";
import { Document, model, Model, models, Schema } from "mongoose";

export interface IUser extends Document, IUserField {
    _id:string
    createAt: Date
    updateAt: Date
}


const userSchema = new Schema<IUser>(
    {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

 const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)
 export default User;