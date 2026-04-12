import React, { useEffect, useState, useMemo } from 'react'
import { Sparkles, Gem, Activity } from 'lucide-react'
import { useAuth, useUser } from '@clerk/react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const SkeletonLoader = () => (
   <div className="animate-pulse space-y-4 max-w-5xl">
       {[1, 2, 3].map(i => (
           <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
       ))}
   </div>
)

const Dashboard = () => {
  const [creations, setCreations] = useState(() => {
    const cached = localStorage.getItem('dashboard_creations');
    return cached ? JSON.parse(cached) : [];
  })
  const [plan, setPlan] = useState(user?.publicMetadata?.plan || 'free')
  const [loading, setLoading] = useState(!creations.length)
  const { getToken } = useAuth()
  const { user } = useUser()

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        setCreations(data.creations)
        if (data.plan) {
            setPlan(data.plan)
        }
        localStorage.setItem('dashboard_creations', JSON.stringify(data.creations));
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        data.push({
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateString: d.toDateString(),
            Generations: 0
        });
    }

    creations.forEach(c => {
        const cDate = new Date(c.created_at || c.createdAt || Date.now());
        const match = data.find(d => cDate.toDateString() === d.dateString);
        if(match) {
            match.Generations += 1;
        }
    });
    return data;
  }, [creations]);

  const isPremium = plan === 'premium';

  return (
    <div className='h-full overflow-y-scroll p-6 tracking-wide'>
      <div className='flex justify-start gap-4 flex-wrap'>
        {/* Total Creations Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
          <div className='text-slate-600 dark:text-slate-400'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-2xl font-semibold text-slate-800 dark:text-white mt-1'>{creations.length}</h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-linear-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center shadow-lg shadow-blue-500/20'>
            <Sparkles className='w-6 text-white' />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
          <div className='text-slate-600 dark:text-slate-400'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-2xl font-semibold text-slate-800 dark:text-white mt-1'>
              {isPremium ? 'Premium' : 'Free'}
            </h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-linear-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center shadow-lg shadow-purple-500/20'>
            <Gem className='w-6 text-white' />
          </div>
        </div>
      </div >

      {
        loading ?
          (
            <div className='mt-8 max-w-5xl'>
               <p className='mb-4 text-slate-600 dark:text-slate-300 font-medium'>Loading Analytics...</p>
               <SkeletonLoader />
            </div>
          )
          :
          (
            <div className='mt-8'>
              
              {/* Analytics Chart - Premium only */}
              {isPremium && (
              <div className='max-w-5xl bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm mb-8'>
                <div className='flex items-center gap-2 mb-6'>
                    <Activity className='w-5 h-5 text-primary' />
                    <h2 className='text-lg font-semibold text-slate-800 dark:text-white'>Activity (Last 7 Days)</h2>
                </div>
                <div className='w-full h-64'>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5044E1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#5044E1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark:stroke="#334155" />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                           itemStyle={{ color: '#c7d2fe' }}
                        />
                        <Area type="monotone" dataKey="Generations" stroke="#5044E1" strokeWidth={3} fillOpacity={1} fill="url(#colorGenerations)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>
              )}

              <div className='space-y-4 max-w-5xl'>
                <h3 className='text-lg font-semibold text-slate-800 dark:text-white'>Recent Creations</h3>
                {creations.length === 0 ? (
                    <div className='p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700'>
                        No creations yet. Start exploring the AI tools!
                    </div>
                ) : (
                    creations.map((item) => <CreationItem key={item.id} item={item} />)
                )}
              </div>
            </div>
          )
      }

    </div>
  )
}

export default Dashboard