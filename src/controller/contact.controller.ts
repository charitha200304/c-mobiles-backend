import { Request, Response } from 'express';
import { contactService } from '../services/contact.service';

/**
 * Handles the submission of a new contact message.
 * POST /api/contact
 */
export const submitContactMessage = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({ message: 'All required fields (First Name, Last Name, Email, Subject, Message) must be provided.' });
        }

        const newMessage = await contactService.createContactMessage({
            firstName,
            lastName,
            email,
            phoneNumber,
            subject,
            message,
        });

        res.status(201).json({ message: 'Your message has been sent successfully!', data: newMessage });
    } catch (error) {
        console.error("Error in contact.controller.submitContactMessage:", error);
        res.status(500).json({ message: 'Failed to send your message. Please try again.', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

// --- Optional: Admin-only routes for managing messages ---
/**
 * Get all contact messages. (Requires authentication/authorization for admin)
 * GET /api/contact
 */
export const getAllContactMessages = async (req: Request, res: Response) => {
    try {
        const messages = await contactService.getAllContactMessages();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contact messages.', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/**
 * Mark a specific contact message as read. (Requires authentication/authorization for admin)
 * PUT /api/contact/:id/read
 */
export const markContactMessageAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedMessage = await contactService.markMessageAsRead(id);
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Contact message not found.' });
        }
        res.status(200).json({ message: 'Message marked as read.', data: updatedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update message status.', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/**
 * Delete a specific contact message. (Requires authentication/authorization for admin)
 * DELETE /api/contact/:id
 */
export const deleteContactMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const isDeleted = await contactService.deleteContactMessage(id);
        if (!isDeleted) {
            return res.status(404).json({ message: 'Contact message not found.' });
        }
        res.status(200).json({ message: 'Contact message deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete message.', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};