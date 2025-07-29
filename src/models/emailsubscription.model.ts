import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
    email: string;
    createdAt: Date;
}

const subscriptionSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, // Prevent duplicates
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt/updatedAt
    }
);

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
