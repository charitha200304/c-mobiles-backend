// D:/IdeaProjects/c-mobiles-backend/src/routes/emailsubscription.routes.ts
import { Router } from 'express';
import { subscribeEmail, getAllSubscriptions } from '../controller/emailsubscription.controller';

const router = Router();

// This route handles POST requests to /api/subscriptions/subscribe
router.post('/subscriptions/subscribe', subscribeEmail);

// Route to get all subscriptions (e.g., for admin)
router.get('/subscriptions', getAllSubscriptions);

export default router;