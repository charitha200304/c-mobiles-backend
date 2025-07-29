// src/app.ts (or src/index.ts) - Main backend entry file
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/DBConnection'; // Your database connection
import productRouter from './routes/product.routes'; // Existing product routes
import authRouter from './routes/auth.routes'; // Your existing auth routes
import contactRouter from './routes/contact.routes'; // <-- NEW: Import contact routes

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter); // Assuming you have an auth router
app.use('/api/contact', contactRouter); // <-- NEW: Use contact routes

// Basic test route
app.get('/', (req, res) => {
    res.send('C-Mobiles Backend API is running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});