import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "What's included in the Free Plan?",
        answer: "The Free Plan provides 10 starter credits and includes access to our Article Generator and Blog Title generator tools. Advanced features like Image Generation, Background Removal, and PDF Summarization are exclusive to Premium users."
    },
    {
        question: "What happens when I upgrade to Premium?",
        answer: "Premium users unlock unlimited access to all AI tools, including Image Generation, Object Removal, and our AI PDF Summarizer. You also get priority processing and higher limits on content length."
    },
    {
        question: "Is my data and document upload secure?",
        answer: "Absolutely. We prioritize your privacy. All file uploads and generated text are processed through secure encryption. Your personal creations and documents are never used for model training without your permission."
    },
    {
        question: "Can I use the generated content commercially?",
        answer: "Yes! You have full commercial ownership of everything you create with Rapid-AI. This includes articles, blog titles, and images used for business, social media, or marketing."
    },
    {
        question: "How do I manage my subscription?",
        answer: "You can manage your plan, view billing history, or cancel your subscription at any time through the 'Settings' page or your Clerk account dashboard. Access continues until the end of your billing cycle."
    },
    {
        question: "Can I switch between plans?",
        answer: "Of course! You can upgrade from Free to Premium instantly. If you choose to downgrade, your account will return to the Free tier at the end of your current paid period."
    },
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
