// D:/IdeaProjects/c-mobiles-backend/src/models/contact.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    subject?: string; // Optional field
    message: string;
    submittedAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    subject: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;