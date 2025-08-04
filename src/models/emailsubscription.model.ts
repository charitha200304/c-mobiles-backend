// D:/IdeaProjects/c-mobiles-backend/src/models/emailsubscription.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailSubscription extends Document {
    email: string;
    subscribedAt: Date;
}

const EmailSubscriptionSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Email must be unique to prevent duplicate subscriptions
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

const EmailSubscription = mongoose.model<IEmailSubscription>('EmailSubscription', EmailSubscriptionSchema);

export default EmailSubscription;