import mongoose, { Schema, Document } from 'mongoose';

// admin interface
export interface IAdmin extends Document {
    adminUsername: string;
    adminPassword: string;
    adminEmail: string;
}

const adminUserSchema = new Schema<IAdmin>({
    adminUsername: { type: String, required: true },   
    adminPassword: { type: String, required: true },
    adminEmail: { type: String, required: true },
});

const adminUserModel = mongoose.model<IAdmin>('adminUserModel', adminUserSchema,'admin_collection');

export default adminUserModel;
