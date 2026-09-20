import React from 'react'
import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PremiumToolNotice = ({ title, message, accentClass = 'text-primary', gradientClass = 'from-primary to-purple-600' }) => {
    const navigate = useNavigate()

    return (
        <div className='flex-1 h-full flex items-center justify-center p-6'>
            <div className='max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl text-center'>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-100 dark:bg-slate-700/60 ${accentClass}`}>
                    <Crown className='w-10 h-10 fill-current' />
                </div>
                <h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-3'>Premium Tool</h2>
                <p className='text-slate-500 dark:text-slate-400 mb-8'>{message}</p>
                <button
                    onClick={() => navigate('/ai/settings')}
                    className={`w-full py-3 bg-linear-to-r ${gradientClass} text-white rounded-xl font-semibold shadow-lg transition-all cursor-pointer`}
                >
                    {title || 'Upgrade to Premium'}
                </button>
            </div>
        </div>
    )
}

export default PremiumToolNotice
