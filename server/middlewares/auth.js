// Middleware to check userID and hasPremiumplan

import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";

export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId); 
        const userEmail = user.emailAddresses?.[0]?.emailAddress;

        // 1. Check all metadata locations (Public, Private, Unsafe)
        const allMetadata = {
            ...(user.publicMetadata || {}),
            ...(user.privateMetadata || {}),
            ...(user.unsafeMetadata || {})
        };
        
        // 2. Manual Override List (Add friend's email here for immediate bypass)
        const premiumEmails = ['premium-user@example.com', 'siddhaarth.verma@example.com']; // Temporary whitelist
        
        let hasPremiumplan = allMetadata.plan === 'premium' || allMetadata.role === 'premium' || premiumEmails.includes(userEmail);

        // 3. Super-Discovery: Check all possible Clerk subscription locations
        if (!hasPremiumplan) {
            const allSubs = [
                ...(user.subscriptionRecords || []),
                ...(user.subscriptions || []),
                ...(user.billing_subscriptions || []),
                ...(user.external_accounts || [])
            ];

            const hasActiveStatus = allSubs.some(sub => 
                ['active', 'trialing', 'pro', 'premium', 'Success'].includes(sub.status) ||
                sub.status?.toLowerCase() === 'active' ||
                ['premium', 'pro'].includes(sub.plan?.toLowerCase())
            );

            // Deep scan for 'premium' keyword in all metadata values
            const metadataString = JSON.stringify(allMetadata).toLowerCase();
            const hasPremiumInMeta = metadataString.includes('premium') || metadataString.includes('pro');

            if (hasActiveStatus || hasPremiumInMeta) {
                hasPremiumplan = true;
                // Force sync metadata so frontend UI catches up
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
