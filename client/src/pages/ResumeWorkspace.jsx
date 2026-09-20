import React from 'react'
import { FileText, TrendingUp } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom'

const ResumeWorkspace = () => {
    const location = useLocation()
    const layoutContext = useOutletContext()
    const tabs = [
        { path: 'review', label: 'Resume Review', Icon: FileText },
        { path: 'match', label: 'Resume-Job Match', Icon: TrendingUp }
    ]

    if (location.pathname === '/ai/resume-tools') {
        return <Navigate to='/ai/resume-tools/review' replace />
    }

    return (
        <div className='h-full flex flex-col overflow-hidden'>
            <div className='px-6 pt-5 shrink-0'>
                <div className='inline-flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'>
                    {tabs.map(({ path, label, Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-linear-to-r from-[#E11D48] to-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
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

export default ResumeWorkspace
