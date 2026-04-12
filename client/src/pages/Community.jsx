import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { useUser, useAuth } from '@clerk/react'
import { Heart } from 'lucide-react'
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
    const [creations, setCreations] = useState(() => {
        const cached = localStorage.getItem('community_creations');
        return cached ? JSON.parse(cached) : [];
    })
    const { user } = useUser()
    const [loading, setLoading] = useState(!creations.length)
    const { getToken } = useAuth()

    const fetchCreations = async () => {
        try {
            const { data } = await axios.get('/api/user/get-published-creations', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setCreations(data.creations)
                localStorage.setItem('community_creations', JSON.stringify(data.creations));
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    const imageLikeToggle = async (id) => {
        try {
            const { data } = await axios.post('/api/user/toggle-like-creation', { id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                await fetchCreations()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchCreations()
        }
    }, [user])

    return !loading ? (
        <div className='flex-1 h-full flex flex-col gap-4 p-6 overflow-y-scroll'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-semibold text-slate-800 dark:text-white'>Community Showcase</h1>
                <p className='text-sm text-slate-500 dark:text-slate-400'>{creations.length} creations shared</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6'>
                {
                    creations.length === 0 ? (
                        <div className='col-span-3 flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 gap-4'>
                            <p className='text-lg'>No community creations yet!</p>
                            <p className='text-sm'>Be the first to publish an AI-generated image</p>
                        </div>
                    ) : (
                        creations.map((creation, index) => (
                            <div key={index} className='relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all'>
                                <img src={creation.content} alt={creation.prompt} className='w-full aspect-square object-cover' />

                                <div className='absolute bottom-0 left-0 right-0 flex gap-2 items-end justify-between p-3 bg-linear-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                    <p className='text-xs line-clamp-2 flex-1'>{creation.prompt}</p>
                                    <div className='flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full shrink-0'>
                                        <p className='text-sm font-medium'>{creation.likes.length}</p>
                                        <Heart
                                            onClick={() => imageLikeToggle(creation.id)}
                                            className={`min-w-4 h-4 hover:scale-125 cursor-pointer transition-transform ${creation.likes?.includes(user?.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    ) :
        (
            <div className='p-6 w-full'>
                <h1 className='text-2xl font-semibold text-slate-800 dark:text-white mb-4'>Community Showcase</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className='animate-pulse rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 aspect-square shadow-sm'></div>
                    ))}
                </div>
            </div>
        )
}

export default Community