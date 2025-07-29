// src/routes/subscription.routes.ts

import { Router } from 'express';
import { subscribeEmail } from '../controller/emailsubscription.controller';

const subscriptionRouter: Router = Router();

subscriptionRouter.post('/subscribe', subscribeEmail);

export default subscriptionRouter;