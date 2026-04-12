import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How many free credits do I get?",
        answer: "Every new free user receives 10 trial credits to test all our AI tools, including article writing, image generation, and background removal."
    },
    {
        question: "What happens when I upgrade to Premium?",
        answer: "Premium users get unlimited access to all AI models, faster generation times, and priority email support. There are no limits on background or object removals."
    },
    {
        question: "Can I use the generated images commercially?",
        answer: "Yes, you have full commercial rights to any images or articles you generate using Rapid AI, regardless of whether you are on a free or premium plan."
    },
    {
        question: "Do you offer API access?",
        answer: "We currently do not offer public API access. The tools are designed to be used natively within our dashboard interface."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="py-20 px-6 max-w-3xl mx-auto">
            <div className='text-center mb-12'>
                <h2 className='text-slate-700 dark:text-white text-3xl md:text-5xl font-semibold mb-4'>Frequently Asked Questions</h2>
                <p className='text-gray-500 dark:text-slate-400'>Got questions? We've got answers.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors"
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none cursor-pointer"
                        >
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{faq.question}</span>
                            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4 pt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
