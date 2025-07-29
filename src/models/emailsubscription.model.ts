// src/models/subscription.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    email: string;
    createdAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // <--- KEEP THIS ONE for the unique index
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email format validation
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// REMOVED: SubscriptionSchema.index({ email: 1 }, { unique: true }); // This line was redundant

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;