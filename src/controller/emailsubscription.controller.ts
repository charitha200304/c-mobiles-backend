// D:/IdeaProjects/c-mobiles-backend/src/controllers/emailsubscription.controller.ts
import { Request, Response } from 'express';
import EmailSubscription from '../models/emailsubscription.model';
import mongoose from 'mongoose';

export const subscribeEmail = async (req: Request, res: Response) => {
    console.log('--- Inside subscribeEmail controller ---');
    console.log('Request Body Received:', req.body);

    try {
        const { email } = req.body;

        if (!email) {
            console.warn('Validation Error: Email is required for subscription.');
            return res.status(400).json({ success: false, message: 'Email is required for subscription.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn(`Validation Error: Invalid email format for ${email}`);
            return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        }

        const existingSubscription = await EmailSubscription.findOne({ email });
        if (existingSubscription) {
            console.warn(`Conflict: Email '${email}' is already subscribed.`);
            return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
        }

        const newSubscription = new EmailSubscription({ email });
        await newSubscription.save();
        console.log(`Email '${email}' subscribed successfully.`);

        res.status(201).json({ success: true, message: 'Successfully subscribed to email updates!' });

    } catch (error: any) {
        console.error('Error during email subscription:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ success: false, message: `Validation failed: ${messages.join(', ')}` });
        } else if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to subscribe due to a server error.', error: error.message });
        }
    }
};

// You might also want a controller to get all subscriptions (e.g., for an admin panel)
export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await EmailSubscription.find().sort({ subscribedAt: -1 });
        res.status(200).json({ success: true, subscriptions });
    } catch (error: any) {
        console.error('Error fetching email subscriptions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch subscriptions.', error: error.message });
    }
};