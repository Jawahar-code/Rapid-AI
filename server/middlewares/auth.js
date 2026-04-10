// Middleware to check userID and hasPremiumplan

import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId); // cruical line for implementing the AI features (spent lot of time debugging)
        
        const hasPremiumplan = user.publicMetadata?.plan === 'premium';

        if (!hasPremiumplan && user.privateMetadata?.free_usage) {
            req.free_usage = user.privateMetadata.free_usage
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumplan ? 'premium' : 'free';
        next()
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
