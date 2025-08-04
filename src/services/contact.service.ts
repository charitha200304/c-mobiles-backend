import Contact, { IContact } from '../models/contact.model';

class ContactService {
    /**
     * Save a new contact message to the database.
     */
    async createContactMessage(messageData: {
        name: string;
        email: string;
        subject?: string;
        message: string;
    }): Promise<IContact> {
        try {
            const newMessage = new Contact({
                name: messageData.name,
                email: messageData.email,
                subject: messageData.subject,
                message: messageData.message
            });
            return await newMessage.save();
        } catch (error) {
            console.error("Error in ContactService.createContactMessage:", error);
            throw new Error('Failed to save contact message.');
        }
    }

    /**
     * Get all contact messages. (For admin panel)
     */
    async getAllContactMessages(): Promise<IContact[]> {
        try {
            return await Contact.find().sort({ submittedAt: -1 });
        } catch (error) {
            console.error("Error in ContactService.getAllContactMessages:", error);
            throw new Error('Failed to fetch contact messages.');
        }
    }

    /**
     * Delete a contact message. (For admin panel)
     */
    async deleteContactMessage(id: string): Promise<boolean> {
        try {
            const result = await Contact.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error("Error in ContactService.deleteContactMessage:", error);
            throw new Error('Failed to delete contact message.');
        }
    }
}

export const contactService = new ContactService();