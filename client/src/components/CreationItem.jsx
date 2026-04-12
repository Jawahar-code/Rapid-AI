import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Markdown from 'react-markdown'
import { Download, Copy, Check } from 'lucide-react'

const CreationItem = ({ item }) => {

    const [expanded, setExpanded] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleDownloadText = (e) => {
        e.stopPropagation();
        const element = document.createElement("a");
        const file = new Blob([item.content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `rapid_ai_export_${Date.now()}.txt`;
        document.body.appendChild(element); 
        element.click();
        document.body.removeChild(element);
    }

    const handleDownloadImage = (e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = item.content;
        a.download = `rapid_ai_image_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div onClick={() => setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer mb-3 transition-colors hover:border-primary/30 dark:hover:border-primary/50'>
            <div className='flex justify-between items-center gap-4'>
                <div>
                    <h2 className='text-slate-800 dark:text-slate-200 font-medium'>{item.prompt}</h2>
                    <p className='text-gray-500 dark:text-slate-400 mt-1 capitalize'>{item.type.replace('-', ' ')} <span className='mx-1'>•</span> {new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <button className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-medium capitalize'>
                    {item.type.replace('-', ' ')}
                </button>
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
                            <hr className='my-4 border-slate-200 dark:border-slate-700' />
                            {item.type === 'image' || item.type === 'remove-background' || item.type === 'remove-object' ? (
                                <div className='relative group inline-block'>
                                    <div className='relative mt-1'>
                                        <img src={item.content} alt="image" className='w-full max-w-md rounded-lg object-cover' />
                                        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <button onClick={handleDownloadImage} className='bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-lg cursor-pointer transition-colors shadow-lg'>
                                                <Download className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='mt-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 relative group'>
                                    <div className='absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button onClick={handleCopy} className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary p-1.5 rounded shadow-sm cursor-pointer transition-colors'>
                                            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4' />}
                                        </button>
                                        <button onClick={handleDownloadText} className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary p-1.5 rounded shadow-sm cursor-pointer transition-colors'>
                                            <Download className='w-4 h-4' />
                                        </button>
                                    </div>
                                    <div className='h-full overflow-y-scroll text-sm text-slate-700 dark:text-slate-300 max-h-96 pr-2 custom-scrollbar'>
                                        <div className='reset-tw'>
                                            <Markdown>{item.content}</Markdown>
                                        </div>
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