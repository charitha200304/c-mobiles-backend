// D:/IdeaProjects/c-mobiles-backend/src/controllers/contact.controller.ts
import { Request, Response } from 'express';
import Contact, { IContact } from '../models/contact.model';
import mongoose from 'mongoose';

export const submitContactForm = async (req: Request, res: Response) => {
    console.log('--- Inside submitContactForm controller ---');
    console.log('Request Body Received:', req.body);

    try {
        const { name: receivedName, firstName, lastName, email, subject, message } = req.body;

        // Determine the final 'name' to use
        const finalName = receivedName || `${firstName || ''} ${lastName || ''}`.trim();

        if (!finalName || !email || !message) {
            console.warn('Validation Error: Missing required contact form fields (name, email, message).');
            return res.status(400).json({ success: false, message: 'Name, email, and message are required fields.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn(`Validation Error: Invalid email format for ${email}`);
            return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        }

        const newContact: IContact = new Contact({
            name: finalName,
            email,
            subject,
            message
        });

        const savedContact = await newContact.save();
        console.log('Contact form submitted and saved successfully. Contact ID:', savedContact._id);

        res.status(201).json({ success: true, message: 'Your message has been sent successfully!', contact: savedContact });

    } catch (error: any) {
        console.error('Error submitting contact form (detailed):', error);
        console.error('Error name:', error.name);
        if (error.code) console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ success: false, message: `Validation failed: ${messages.join(', ')}` });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to send message due to a server error.', error: error.message });
        }
    }
};

export const getAllContactMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Contact.find().sort({ submittedAt: -1 });
        res.status(200).json({ success: true, messages });
    } catch (error: any) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contact messages.', error: error.message });
    }
};