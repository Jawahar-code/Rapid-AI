import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X, Zap, Crown } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser, UserButton, useAuth } from '@clerk/react'
import ThemeToggle from '../components/ThemeToggle'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Layout = () => {

  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()
  const { getToken } = useAuth()
  const [creationsCount, setCreationsCount] = useState(user?.publicMetadata?.free_usage || 0)
  const [plan, setPlan] = useState(user?.publicMetadata?.plan || 'free')

  const fetchUsageAndPlan = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreationsCount(data.creations.length)
        if (data.plan) {
            setPlan(data.plan)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      setCreationsCount(user?.publicMetadata?.free_usage || 0)
      setPlan(user?.publicMetadata?.plan || 'free')
      fetchUsageAndPlan()
    }
  }, [user])

  // --- AUTOMATIC SUBSCRIPTION SYNC ---
  // If the frontend sees an active subscription but the plan state is still 'free',
  // we force a sync with the backend to update metadata immediately.
  useEffect(() => {
    const checkAndSync = async () => {
        const hasActiveSub = user?.subscriptionRecords?.some(sub => sub.status === 'active');
        if (hasActiveSub && plan !== 'premium') {
            try {
                const { data } = await axios.post('/api/user/sync-premium', {}, {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                });
                if (data.success) {
                    setPlan('premium');
                }
            } catch (error) {
                console.error("Auto-sync failed:", error);
            }
        }
    };
    if (user) checkAndSync();
  }, [user, plan]);

  const isPremium = plan === 'premium';
  const remainingCredits = Math.max(0, 10 - creationsCount);

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300'>

      <nav className='w-full px-4 sm:px-8 min-h-16 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md z-10 transition-all duration-300'>
        {/* Left Section: Logo */}
        <div className='flex items-center'>
            <img src={assets.logo} alt="Logo" onClick={() => navigate('/')} className='cursor-pointer w-32 sm:w-40' />
        </div>

        {/* Right Section: Header Actions */}
        <div className='flex items-center gap-3 sm:gap-4'>

            {/* Plan & Credits - Clean combined pill */}
            <div className='hidden sm:flex items-center gap-2'>
                {isPremium ? (
                    <div className='flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 px-3.5 py-1.5 rounded-full text-xs font-semibold'>
                        <Crown className='w-3.5 h-3.5 fill-current' />
                        <span>Premium</span>
                        <span className='text-purple-400 dark:text-purple-500 mx-0.5'>•</span>
                        <span>Unlimited</span>
                    </div>
                ) : (
                    <div className='flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3.5 py-1.5 rounded-full text-xs font-semibold'>
                        <Zap className='w-3.5 h-3.5 text-amber-500 fill-amber-500' />
                        <span>Free</span>
                        <span className='text-slate-300 dark:text-slate-600 mx-0.5'>•</span>
                        <span>{remainingCredits} credits</span>
                    </div>
                )}
            </div>

            <ThemeToggle />
            
            {/* User Button natively supports clerk popover */}
            <UserButton />

            {/* Mobile Menu Toggle */}
            {
            sidebar ?
                <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition cursor-pointer sm:hidden' />
                :
                <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition cursor-pointer sm:hidden' />
            }
        </div>
      </nav>

      <div className='flex-1 w-full flex h-[calc(100vh-64px)] relative'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className='flex-1 bg-slate-50 dark:bg-slate-900 w-full overflow-hidden transition-colors duration-300'>
          <Outlet />
        </div>
      </div>

    </div>
  ) : 
  (
    <div className='flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900'>
      <SignIn />
    </div>
  )
}

export default Layout