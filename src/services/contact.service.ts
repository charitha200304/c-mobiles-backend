import { ContactMessage, IContactMessage } from '../models/contactMessage.model';

class ContactService {
    /**
     * Save a new contact message to the database.
     */
    async createContactMessage(messageData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        subject: string;
        message: string;
    }): Promise<IContactMessage> {
        try {
            const newMessage = new ContactMessage(messageData);
            return await newMessage.save();
        } catch (error) {
            console.error("Error in ContactService.createContactMessage:", error);
            throw new Error('Failed to save contact message.');
        }
    }

    /**
     * Get all contact messages. (For admin panel)
     */
    async getAllContactMessages(): Promise<IContactMessage[]> {
        try {
            return await ContactMessage.find().sort({ createdAt: -1 });
        } catch (error) {
            console.error("Error in ContactService.getAllContactMessages:", error);
            throw new Error('Failed to fetch contact messages.');
        }
    }

    /**
     * Mark a contact message as read. (For admin panel)
     */
    async markMessageAsRead(id: string): Promise<IContactMessage | null> {
        try {
            return await ContactMessage.findByIdAndUpdate(
                id,
                { read: true },
                { new: true }
            );
        } catch (error) {
            console.error("Error in ContactService.markMessageAsRead:", error);
            throw new Error('Failed to update contact message status.');
        }
    }

    /**
     * Delete a contact message. (For admin panel)
     */
    async deleteContactMessage(id: string): Promise<boolean> {
        try {
            const result = await ContactMessage.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error("Error in ContactService.deleteContactMessage:", error);
            throw new Error('Failed to delete contact message.');
        }
    }
}

export const contactService = new ContactService();