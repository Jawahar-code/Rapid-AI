import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Typewriter } from 'react-simple-typewriter'
import { X, Play } from 'lucide-react'

const Hero = () => {

    const navigate = useNavigate()
    const [showDemo, setShowDemo] = useState(false)

    return (
        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center items-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen pt-20'>

            <div className='text-center mb-6'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] text-slate-800 dark:text-white'>
                    Create {' '}
                    <span className='text-primary'>
                        <Typewriter
                            words={[
                                'Cool AI Articles',
                                'Amazing AI Images',
                                'Instant PDF Summaries',
                                'Fast Photo Editing',
                                'Great Blog Titles',
                            ]}
                            loop={0}
                            cursor
                            cursorStyle='|'
                            typeSpeed={50}
                            deleteSpeed={50}
                            delaySpeed={1500}
                        />
                    </span>
                    <br /> with <span>our AI tools</span>
                </h1>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600 dark:text-gray-300'>"The all-in-one platform for modern creators. Speed up your work and unlock your potential with the power of generative AI."
                </p>
            </div>

            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button onClick={() => navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer hover:shadow-lg hover:shadow-primary/30'>Start Creating now</button>
                <button onClick={() => setShowDemo(true)} className='flex items-center gap-2 bg-white dark:bg-white/10 backdrop-blur-sm text-slate-800 dark:text-white px-10 py-3 rounded-lg border border-gray-300 dark:border-white/20 hover:scale-102 active:scale-95 transition cursor-pointer'>
                    <Play className='w-4 h-4 fill-current' />
                    Watch Demo
                </button>
            </div>

            <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600 dark:text-gray-300'>
                <img src={assets.user_group} alt="" className='h-8' /> Trusted by 5k+ people
            </div>

            {/* Bottom gradient fade — blends hero bg into the page background */}
            <div className='absolute bottom-0 left-0 w-full h-40 bg-linear-to-b from-transparent to-white dark:to-slate-900 pointer-events-none'></div>

            {/* Video Demo Modal */}
            {showDemo && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in'
                    onClick={() => setShowDemo(false)}
                >
                    {/* Backdrop */}
                    <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />

                    {/* Modal Content */}
                    <div
                        className='relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-scale-in'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className='flex items-center justify-between px-5 py-3 border-b border-white/10'>
                            <div className='flex items-center gap-2'>
                                <div className='w-3 h-3 rounded-full bg-red-500' />
                                <div className='w-3 h-3 rounded-full bg-yellow-500' />
                                <div className='w-3 h-3 rounded-full bg-green-500' />
                            </div>
                            <h3 className='text-sm font-medium text-white/70'>Rapid AI — Demo</h3>
                            <button
                                onClick={() => setShowDemo(false)}
                                className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition cursor-pointer'
                            >
                                <X className='w-4 h-4 text-white/60' />
                            </button>
                        </div>

                        {/* Video */}
                        <div className='aspect-video'>
                            <iframe
                                src="https://drive.google.com/file/d/1dq1qPROVShjQJg7EvUGJvBcHmNbS1DpQ/preview"
                                className='w-full h-full'
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title="Rapid AI Demo"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.25s ease-out; }
                .animate-scale-in { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </div>
    )
}

export default Hero