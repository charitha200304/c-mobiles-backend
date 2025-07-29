import Subscription, { ISubscription } from '../models/emailsubscription.model';

class SubscriptionService {
    /**
     * Subscribes a new email to the newsletter list.
     * @param email The email address to subscribe.
     * @returns The created subscription document.
     * @throws Error if email already exists or other database errors.
     */
    public async subscribeEmail(email: string): Promise<ISubscription> {
        try {
            // Check if email already exists
            const existingSubscription = await Subscription.findOne({ email });
            if (existingSubscription) {
                throw new Error('Email is already subscribed.');
            }

            const newSubscription = new Subscription({ email });
            await newSubscription.save();
            return newSubscription;
        } catch (error: any) {
            console.error('Error in SubscriptionService.subscribeEmail:', error);
            throw new Error(error.message || 'Failed to subscribe email.');
        }
    }

    /**
     * Finds a subscription by email.
     * @param email The email to search for.
     * @returns The subscription document if found, otherwise null.
     */
    public async findSubscriptionByEmail(email: string): Promise<ISubscription | null> {
        try {
            return await Subscription.findOne({ email });
        } catch (error: any) {
            console.error('Error in SubscriptionService.findSubscriptionByEmail:', error);
            throw new Error('Failed to retrieve subscription by email.');
        }
    }

    // You can add more methods here, like unsubscribe, getAllSubscriptions, etc.
}

export const subscriptionService = new SubscriptionService();