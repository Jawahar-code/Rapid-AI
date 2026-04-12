// Middleware to check userID and hasPremiumplan

import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";

export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId); 
        
        // Use a more robust check for premium status
        // First check metadata, then check native Clerk subscription records if available
        let hasPremiumplan = user.publicMetadata?.plan === 'premium';
        
        // Self-Healing Logic: If Clerk shows active subscription but metadata is missing
        // This handles cases where the user just bought a plan but the metadata hasn't synced
        if (!hasPremiumplan && user.subscriptionRecords) {
            const hasActiveSub = user.subscriptionRecords.some(sub => sub.status === 'active');
            if (hasActiveSub) {
                hasPremiumplan = true;
                // Sync metadata for future requests and frontend useUser() hook
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: { plan: 'premium' }
                });
            }
        }

        // Use database as source of truth for usage instead of Clerk metadata
        const [{ count }] = await sql`SELECT count(*)::int FROM creations WHERE user_id = ${userId}`;
        req.free_usage = count;

        if (!hasPremiumplan) {
            // Optional: Sync back usage count to Clerk if they strictly want to see it there too
            if (user.publicMetadata?.free_usage !== count) {
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
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
