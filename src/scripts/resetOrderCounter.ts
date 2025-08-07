import mongoose from 'mongoose';
import { Counter } from '../models/counter.model';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Cmobiles';

async function resetOrderCounter() {
  try {
    await mongoose.connect(MONGO_URI);
    const result = await Counter.findOneAndUpdate(
      { _id: 'orderId' },
      { $set: { seq: 0 } },
      { upsert: true, new: true }
    );
    console.log('Order counter reset:', result);
  } catch (err) {
    console.error('Error resetting order counter:', err);
  } finally {
    await mongoose.disconnect();
  }
}

resetOrderCounter();
