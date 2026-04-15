import { useClerk, useUser } from '@clerk/react'
import Protect from './Protect'
import { Eraser, FileText, Hash, House, Image, LogOut, LogOutIcon, Scissors, SquarePen, Users, Settings, ChevronDown, Briefcase, PlusCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = ({ sidebar, setSidebar, plan, creationsCount }) => {
    const { user } = useUser()
    const { signOut, openUserProfile } = useClerk()
    const location = useLocation()

    // State for dropdowns
    const [openPro, setOpenPro] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)

    // Auto-open dropdown if active route is inside
    useEffect(() => {
        const proRoutes = ['/ai/write-article', '/ai/blog-titles', '/ai/pdf-summarizer', '/ai/review-resume']
        const addRoutes = ['/ai/generate-images', '/ai/remove-background', '/ai/remove-object']
        
        if (proRoutes.includes(location.pathname)) setOpenPro(true)
        if (addRoutes.includes(location.pathname)) setOpenAdd(true)
    }, [location.pathname])

    const NavItem = ({ to, label, Icon, onClick }) => (
// ... same ...
        <NavLink
            to={to}
            end={to === '/ai'}
            onClick={() => {
                if (onClick) onClick()
                setSidebar(false)
            }}
            className={({ isActive }) => `px-3.5 py-2 flex items-center gap-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 ${isActive ? 'bg-linear-to-r from-primary to-purple-600 text-white dark:text-white shadow-md' : ''} `}>
            {({ isActive }) => (
                <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="text-[13.5px] font-medium">{label}</span>
                </>
            )}
        </NavLink>
    )

    const DropdownHeader = ({ label, Icon, isOpen, setIsOpen }) => (
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-3.5 py-2.5 mt-1 flex items-center justify-between rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 ${isOpen ? 'text-primary dark:text-primary font-semibold' : ''}`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isOpen ? 'text-primary' : 'text-slate-500'}`} />
                <span className="text-[13.5px]">{label}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
        </button>
    )

    return (
        <div className={`w-60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between items-center max-sm:absolute top-[64px] bottom-0 z-1 
        ${sidebar ? 'translate-x-0' : `max-sm:-translate-x-full `} 
        transition-all duration-300 ease-in-out`}>

            <div className='my-7 w-full overflow-y-auto custom-scrollbar px-5'>
                <img src={user.imageUrl} alt="User Avatar" className='w-13 rounded-full mx-auto shadow-lg dark:shadow-slate-800' />
                <h1 className='mt-1 text-center font-medium text-slate-800 dark:text-slate-200'>{user.fullName}</h1>

                <div className='mt-6 flex flex-col gap-1'>
                    <NavItem to='/ai' label='Dashboard' Icon={House} />

                    {/* Professional Tools Group */}
                    <DropdownHeader label="Professional Tools" Icon={Briefcase} isOpen={openPro} setIsOpen={setOpenPro} />
                    <AnimatePresence>
                        {openPro && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4 flex flex-col gap-1"
                            >
                                <NavItem to='/ai/write-article' label='Write Article' Icon={SquarePen} />
                                <NavItem to='/ai/blog-titles' label='Blog Titles' Icon={Hash} />
                                <NavItem to='/ai/pdf-summarizer' label='PDF Summarizer' Icon={FileText} />
                                <NavItem to='/ai/review-resume' label='Review Resume' Icon={Briefcase} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Additional Tools Group */}
                    <DropdownHeader label="Image Toolkit" Icon={PlusCircle} isOpen={openAdd} setIsOpen={setOpenAdd} />
                    <AnimatePresence>
                        {openAdd && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4 flex flex-col gap-1"
                            >
                                <NavItem to='/ai/generate-images' label='Generate Images' Icon={Image} />
                                <NavItem to='/ai/remove-background' label='Remove Background' Icon={Eraser} />
                                <NavItem to='/ai/remove-object' label='Remove Object' Icon={Scissors} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <NavItem to='/ai/community' label='Community' Icon={Users} />
                    <NavItem to='/ai/settings' label='Settings' Icon={Settings} />
                </div>
            </div>

            <div className='w-full border-t border-gray-200 dark:border-slate-800 p-4 px-7 flex items-center justify-between'>
                    <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
                        <img src={user.imageUrl} className="w-8 rounded-full shadow-sm" alt="" />
                        <div>
                            <h1 className='text-sm font-medium text-slate-800 dark:text-slate-200'>{user.fullName}</h1>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                <Protect 
                                    condition={plan === 'premium'}
                                    fallback={<span>Free Plan</span>}
                                >
                                    <span>Premium Plan</span>
                                </Protect>
                            </p>
                        </div>
                    </div>
                    <LogOutIcon onClick={signOut} className='w-5 text-gray-500 hover:text-red-500 transition cursor-pointer'/>
            </div>
        </div>
    )
}

export default Sidebar