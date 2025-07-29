import { Router } from 'express';
import {
    submitContactMessage,
    getAllContactMessages,
    markContactMessageAsRead,
    deleteContactMessage
} from '../controller/contact.controller';

const contactRouter: Router = Router();

// Route for submitting a new contact message
contactRouter.post('/', submitContactMessage);

// --- Optional: Admin routes for managing messages ---
// You would typically add authentication middleware here, e.g., contactRouter.get('/', authMiddleware, getAllContactMessages);
contactRouter.get('/', getAllContactMessages); // Get all messages
contactRouter.put('/:id/read', markContactMessageAsRead); // Mark as read
contactRouter.delete('/:id', deleteContactMessage); // Delete message

export default contactRouter;