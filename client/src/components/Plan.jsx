import React from 'react'
import { PricingTable } from '@clerk/react'

const Plan = () => {
    return (
        /* Changed 'my-30' to 'pt-10 pb-20' to match Testimonial spacing */
        <div className='max-w-2xl mx-auto z-20 pt-10 pb-20'>
            <div className='text-center'>
                <h2 className='text-slate-700 dark:text-white text-[42px] font-semibold mb-3 leading-tight text-center'> Choose our plan</h2>
                <p className='text-gray-500 dark:text-slate-400 max-w-lg mx-auto text-center'>
                    Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
                </p>
            </div>

            <div className='mt-14 max-sm:mx-8'>

                <PricingTable />
            </div>
        </div>


    )
}

export default Plan