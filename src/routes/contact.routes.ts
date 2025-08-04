// D:/IdeaProjects/c-mobiles-backend/src/routes/contact.routes.ts
import { Router } from 'express';
// FIX: Ensure 'controllers' has an 's' in the path
import { submitContactForm, getAllContactMessages } from '../controller/contact.controller';

const router = Router();

router.post('/', submitContactForm);
router.get('/', getAllContactMessages);

export default router;