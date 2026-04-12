import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser, Show, SignInButton, SignUpButton, } from '@clerk/react'
import ThemeToggle from './ThemeToggle'
const Navbar = () => {
    const navigate = useNavigate()
    const { user } = useUser();
    const { openSignIn } = useClerk();
    return (
        <div className='fixed z-10 w-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg border-b border-white/10 dark:border-white/5 flex justify-between items-center py-3 px-4 sm:px-20 xl-px:32 transition-colors duration-300'>
            <img src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer' onClick={() => navigate('/')} />

            <div className='flex items-center gap-4'>
                <ThemeToggle />
                {
                    user ? <UserButton />
                        :
                        (
                            <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-linear-to-r from-primary to-purple-600 text-white px-8 py-2.5 hover:shadow-lg hover:shadow-primary/30 transition-all'>Get Started<ArrowRight className='w-4 h-4' /> </button>
                        )
                }
            </div>

        </div>
    )
}

export default Navbar