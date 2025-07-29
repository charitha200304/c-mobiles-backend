import { Request, Response } from 'express';
import { subscriptionService } from '../services/emailsubscription.service'; // Ensure this path is correct

interface SubscriptionResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

/**
 * Handles subscription of a new email.
 */
export const subscribeEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string' || !/.+@.+\..+/.test(email)) {
            const response: SubscriptionResponse = {
                success: false,
                message: 'A valid email address is required.'
            };
            res.status(400).json(response);
            return;
        }

        const subscription = await subscriptionService.subscribeEmail(email);

        const response: SubscriptionResponse = {
            success: true,
            message: 'Successfully subscribed to newsletter!',
            data: { email: subscription.email, createdAt: subscription.createdAt } // Return minimal data for security
        };
        res.status(201).json(response); // 201 Created for new resource
    } catch (error: any) {
        console.error('Error in subscription.controller.ts -> subscribeEmail:', error);
        let errorMessage = 'Failed to subscribe email.';
        let statusCode = 500;

        if (error.message === 'Email is already subscribed.') {
            errorMessage = error.message;
            statusCode = 409; // Conflict
        }

        const response: SubscriptionResponse = {
            success: false,
            message: errorMessage,
            error: error.message
        };
        res.status(statusCode).json(response);
    }
};