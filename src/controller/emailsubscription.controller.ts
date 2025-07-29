import { Request, Response } from 'express';
import Subscription from '../models/emailsubscription.model';

export const subscribeEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if already subscribed
        const existing = await Subscription.findOne({ email });

        if (existing) {
            return res.status(409).json({ message: 'Email already subscribed' });
        }

        // Save to DB
        const newSubscription = new Subscription({ email });
        await newSubscription.save();

        return res.status(201).json({ message: 'Subscribed and saved successfully!' });
    } catch (error) {
        console.error('❌ Subscription save error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
