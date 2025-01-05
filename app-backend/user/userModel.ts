import mongoose, { Schema, Document, Types } from 'mongoose';

// User interface
export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    password: string;
    email: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },   
    password: { type: String, required: true },
    email: { type: String, required: true },
});

const userModel = mongoose.model<IUser>('userModel', userSchema,'user_collection');

export default userModel;
