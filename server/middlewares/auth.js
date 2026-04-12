import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";

// Middleware to check userID and hasPremiumplan
export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);

        // 1. Discovery: Scan all possible Clerk subscription locations
        const allSubs = [
            ...(user.subscriptionRecords || []),
            ...(user.subscriptions || []),
            ...(user.billing_subscriptions || []),
            ...(user.external_accounts || [])
        ];

        // 2. Determine Actual Subscription Truth (Does a valid sub exist?)
        const hasActiveSubscription = allSubs.some(sub =>
            ['active', 'trialing', 'pro', 'premium', 'Success'].includes(sub.status) ||
            sub.status?.toLowerCase() === 'active' ||
            ['premium', 'pro'].includes(sub.plan?.toLowerCase())
        );

        // 3. Metadata Synchronization (Bi-directional)
        let hasPremiumplan = hasActiveSubscription;

        // Auto-fix Metadata to match Billing Reality
        if (hasActiveSubscription && user.publicMetadata?.plan !== 'premium') {
            // UPGRADE: Clerk Billing says active, but metadata says free/null
            await clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: { plan: 'premium' }
            });
            hasPremiumplan = true;
        } else if (!hasActiveSubscription && user.publicMetadata?.plan === 'premium') {
            // DOWNGRADE: Metadata says premium, but Clerk Billing says no active subscription
            await clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: { plan: 'free' }
            });
            hasPremiumplan = false;
        } else if (user.publicMetadata?.plan === 'premium') {
            // Regular check if metadata is already set
            hasPremiumplan = true;
        }

        // Use database as source of truth for usage instead of Clerk metadata
        const [{ count }] = await sql`SELECT count(*)::int FROM creations WHERE user_id = ${userId}`;
        req.free_usage = count;

        if (!hasPremiumplan) {
            // Sync usage count back to Clerk for the "Credits Remaining" display
            if (user.publicMetadata?.free_usage !== count) {
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        free_usage: count
                    }
                });
            }
        }

        req.plan = hasPremiumplan ? 'premium' : 'free';
        next();

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
