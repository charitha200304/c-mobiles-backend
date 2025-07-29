import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a Contact Message document
export interface IContactMessage extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string; // Optional
    subject: string;
    message: string;
    createdAt: Date;
    read: boolean; // To track if an admin has viewed it
}

// Define the Mongoose Schema for Contact Messages
const ContactMessageSchema: Schema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
    phoneNumber: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

// Export the Mongoose Model
export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);