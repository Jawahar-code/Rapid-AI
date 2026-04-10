import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Markdown from 'react-markdown'

const CreationItem = ({ item }) => {

    const [expanded, setExpanded] = useState(false)

    return (
        <div onClick={() => setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer mb-3'>
            <div className='flex justify-between items-center gap-4'>
                <div>
                    <h2>{item.prompt}</h2>
                    <p className='text-gray-500'>{item.type} ~ {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>{item.type}</button>
            </div>
            <AnimatePresence>
                {
                    expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className='overflow-hidden'
                        >
                            {item.type === 'image' ? (
                                <div>
                                    <img src={item.content} alt="image" className='mt-3 w-full max-w-md' />
                                </div>
                            ) : (
                                <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                                    <div className='reset-tw'>
                                        <Markdown>{item.content}</Markdown>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}

export default CreationItem