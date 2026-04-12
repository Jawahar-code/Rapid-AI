// Middleware to check userID and hasPremiumplan

import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";

export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId); // cruical line for implementing the AI features (spent lot of time debugging)
        
        const hasPremiumplan = user.publicMetadata?.plan === 'premium';

        // Use database as source of truth for usage instead of Clerk metadata
        const [{ count }] = await sql`SELECT count(*)::int FROM creations WHERE user_id = ${userId}`;
        req.free_usage = count;

        if (!hasPremiumplan) {
            // Optional: Sync back to Clerk if they strictly want to see it there too
            if (user.publicMetadata?.free_usage !== count) {
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        free_usage: count
                    },
                    privateMetadata: {
                        free_usage: count
                    }
                });
            }
        } 

        req.plan = hasPremiumplan ? 'premium' : 'free';
        next()
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
