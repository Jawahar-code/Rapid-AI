import React, { useState, useEffect } from 'react';
import { useUser, useClerk, useAuth } from '@clerk/react';
import { Settings as SettingsIcon, User, Shield, CreditCard, LogOut, Zap, Sparkles, Palette, Crown } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Settings = () => {
    const { user } = useUser();
    const clerk = useClerk();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    
    // Use unified state from Layout context
    const { plan, creationsCount } = useOutletContext();

    const isPremium = plan === 'premium';
    const remainingCredits = Math.max(0, 10 - creationsCount);

    const handleOpenProfile = () => {
        try {
            clerk.openUserProfile();
        } catch {
            window.open('https://accounts.clerk.dev/user', '_blank');
        }
    };

    const handleSignOut = () => {
        clerk.signOut();
    };

    return (
        <div className='h-full overflow-y-auto custom-scrollbar p-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-8'>
                <div className='w-12 h-12 rounded-xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20'>
                    <SettingsIcon className='w-6 h-6 text-white' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>Settings</h1>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>Manage your account and preferences</p>
                </div>
            </div>

            {/* Profile Summary Card */}
            <div className='p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm mb-6 flex items-center gap-4'>
                <img src={user?.imageUrl} alt='User Avatar' className='w-16 h-16 rounded-full shadow-md border-2 border-primary/20' />
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold text-slate-800 dark:text-white'>{user?.fullName}</h2>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>{user?.primaryEmailAddress?.emailAddress}</p>
                    <div className='mt-1.5 flex items-center gap-2'>
                        {isPremium ? (
                            <span className='flex items-center gap-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-700/50'>
                                <Crown className='w-3 h-3 fill-current' /> Premium
                            </span>
                        ) : (
                            <span className='flex items-center gap-1 text-xs font-semibold bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 px-2.5 py-1 rounded-full border border-yellow-200 dark:border-yellow-500/20'>
                                <Zap className='w-3 h-3 fill-current' /> Free Plan — {remainingCredits} Credits
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Sections Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                
                {/* Account Section */}
                <div className='bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden'>
                    <div className='flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'>
                        <User className='w-4 h-4 text-blue-500' />
                        <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Account</h3>
                    </div>
                    <div className='divide-y divide-gray-100 dark:divide-slate-700'>
                        <div className='flex items-center justify-between px-5 py-4'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Full Name</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>{user?.fullName || '—'}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between px-5 py-4'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Email Address</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>{user?.primaryEmailAddress?.emailAddress || '—'}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Profile & Password</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Manage via Clerk</p>
                            </div>
                            <button onClick={handleOpenProfile} className='text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'>
                                Edit Profile →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plan & Billing Section */}
                <div className='bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden'>
                    <div className='flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'>
                        <CreditCard className='w-4 h-4 text-purple-500' />
                        <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Plan & Billing</h3>
                    </div>
                    <div className='divide-y divide-gray-100 dark:divide-slate-700'>
                        <div className='flex items-center justify-between px-5 py-4'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Current Plan</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>{isPremium ? 'Premium (Unlimited)' : `Free (${remainingCredits} Credits)`}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${isPremium ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'}`}>
                                {isPremium ? 'premium' : 'free'}
                            </span>
                        </div>
                        <div className='flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Upgrade to Premium</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Unlock unlimited AI generations</p>
                            </div>
                            <button onClick={() => navigate('/#pricing')} disabled={isPremium} className='text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-70'>
                                {isPremium ? 'Already Premium ✓' : 'Upgrade Now →'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className='bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden'>
                    <div className='flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'>
                        <Palette className='w-4 h-4 text-orange-500' />
                        <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Appearance</h3>
                    </div>
                    <div className='px-5 py-5 flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Theme</p>
                            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>Currently using <span className='capitalize'>{theme}</span> mode</p>
                        </div>
                        <button onClick={toggleTheme} className='text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'>
                            Switch to {theme === 'light' ? 'Dark' : 'Light'}
                        </button>
                    </div>
                </div>

                {/* Security Section */}
                <div className='bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden'>
                    <div className='flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'>
                        <Shield className='w-4 h-4 text-green-500' />
                        <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Security</h3>
                    </div>
                    <div className='divide-y divide-gray-100 dark:divide-slate-700'>
                        <div className='flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Session Management</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>View and revoke active sessions</p>
                            </div>
                            <button onClick={handleOpenProfile} className='text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'>
                                Manage Sessions →
                            </button>
                        </div>
                        <div className='flex items-center justify-between px-5 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'>
                            <div>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Sign Out</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Sign out of your Rapid-AI account</p>
                            </div>
                            <button onClick={handleSignOut} className='text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer flex items-center gap-2'>
                                <LogOut className='w-3 h-3' /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <p className='text-center text-xs text-slate-400 dark:text-slate-600 mt-12 pb-6'>Rapid AI • v2.0 🚀</p>
        </div>
    );
};

export default Settings;
    