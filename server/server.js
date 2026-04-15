import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()


connectCloudinary();

app.use(cors())
app.use(express.json())


if (!process.env.CLERK_SECRET_KEY) {
    console.warn("WARNING: CLERK_SECRET_KEY is missing. Auth will fail.");
}

app.use(clerkMiddleware()) 

app.get('/', (req, res) => res.send('Server is Live!'))
app.use(requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    })
}

export default app;