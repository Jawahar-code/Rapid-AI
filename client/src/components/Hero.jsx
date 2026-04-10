import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Typewriter } from 'react-simple-typewriter' // Import the component

const Hero = () => {

    const navigate = useNavigate()

    return (
        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center items-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen pt-20'>

            <div className='text-center mb-6'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>
                    Create {' '}
                    <span className='text-primary'>
                        <Typewriter
                            words={[
                                'Cool AI Articles',
                                'Amazing AI Images',
                                'Smart Resume Help',
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
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>"The all-in-one platform for modern creators. Speed up your work and unlock your potential with the power of generative AI."
                </p>
            </div>

            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button onClick={() => navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transistion cursor-pointer'>Start Creating now</button>
                <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transistion cursor-pointer'>Watch Demo</button>
            </div>

            <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
                <img src={assets.user_group} alt="" className='h-8' /> Trusted by 5k+ people
            </div>
        </div>
    )
}

export default Hero