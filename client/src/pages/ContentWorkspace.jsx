import React from 'react'
import { Edit, Hash } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom'

const ContentWorkspace = () => {
    const location = useLocation()
    const layoutContext = useOutletContext()
    const tabs = [
        { path: 'article', label: 'Write Article', Icon: Edit },
        { path: 'titles', label: 'Blog Titles', Icon: Hash }
    ]

    if (location.pathname === '/ai/content-tools') {
        return <Navigate to='/ai/content-tools/article' replace />
    }

    return (
        <div className='h-full flex flex-col overflow-hidden'>
            <div className='px-6 pt-5 shrink-0'>
                <div className='inline-flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'>
                    {tabs.map(({ path, label, Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <Icon className='w-4 h-4' />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className='min-h-0 flex-1 overflow-hidden'>
                <Outlet context={layoutContext} />
            </div>
        </div>
    )
}

export default ContentWorkspace
