import { FileText, Sparkles, Copy, Download, Check, Crown } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Protect from '../components/Protect';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const { plan, fetchUsageAndPlan } = useOutletContext();
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)

  const { getToken } = useAuth()
  const navigate = useNavigate()

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `rapidai_resume_review_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if (!input || !(input instanceof File)) {
        setLoading(false)
        return toast.error('Please select a valid PDF file!')
      }

      // Validate file type
      if (input.type !== 'application/pdf') {
        setLoading(false)
        return toast.error('Please upload a PDF file only!')
      }

      const formData = new FormData()
      formData.append('resume', input)

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Resume reviewed successfully!')
        fetchUsageAndPlan();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <Protect 
      condition={plan === 'premium'}
      fallback={
        <div className='flex-1 h-full flex items-center justify-center p-6'>
          <div className='max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl text-center'>
            <div className='w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00DA83]'>
              <Crown className='w-10 h-10 fill-current' />
            </div>
            <h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-3'>Premium Tool</h2>
            <p className='text-slate-500 dark:text-slate-400 mb-8'>AI Resume Review is a premium feature. Upgrade your plan to get detailed feedback and score improvements for your career.</p>
            <button 
              onClick={() => navigate('/ai/settings')}
              className='w-full py-3 bg-linear-to-r from-[#00DA83] to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all cursor-pointer'
            >
              Upgrade Now
            </button>
          </div>
        </div>
      }
    >

      <div className='h-full p-6 flex items-start flex-col lg:flex-row gap-6 text-slate-700 dark:text-slate-200 transition-colors overflow-hidden'>
        {/* left col */}
        <form onSubmit={onSubmitHandler} action="" className='w-full lg:w-[45%] p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm shrink-0'>
          <div className='flex items-center gap-3 mb-6'>
            <Sparkles className='w-6 text-[#F59E0B]' />
            <h1 className='text-xl font-semibold dark:text-white'>Resume Review</h1>
          </div>
          <p className='text-sm font-medium dark:text-slate-300'>Upload Resume</p>

          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept='application/pdf'
            className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-transparent file:font-medium file:border-0 file:bg-[#F59E0B] file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-amber-600 transition-all'
            required
          />

          <p className='text-xs text-gray-500 dark:text-slate-400 font-light mt-2'>Supports PDF resume only</p>

          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#F59E0B] to-amber-600 hover:shadow-lg hover:shadow-amber-500/30 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all disabled:opacity-70'>
            {
              loading ?
                <span className='w-4 h-4 my-1 rounded-full border-2 border-t-white border-r-transparent animate-spin'></span>
                :
                <FileText className='w-5' />
            }

            Review Resume
          </button>
        </form>

        {/* right col */}
        <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <FileText className='w-5 h-5 text-[#F59E0B]' />
              <h1 className='text-xl font-semibold dark:text-white'>Analysis Results</h1>
            </div>
            {content && (
              <div className='flex items-center gap-2'>
                <button onClick={handleCopy} className='flex items-center gap-1.5 text-xs border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'>
                  {copied ? <Check className='w-3.5 h-3.5 text-green-500' /> : <Copy className='w-3.5 h-3.5' />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleDownload} className='flex items-center gap-1.5 text-xs border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'>
                  <Download className='w-3.5 h-3.5' /> Download
                </button>
              </div>
            )}
          </div>

          <hr className='mt-4 mb-2 border-gray-200 dark:border-slate-700 shrink-0' />
          {
            !content ?
              (
                <div className='flex-1 flex justify-center items-center'>
                  <div className='text-sm flex flex-col items-center gap-5 text-gray-400 dark:text-slate-500'>
                    <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800'>
                      <FileText className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                    </div>
                    <p className='text-center'>Upload a resume and click "Review Resume" to get started</p>
                  </div>
                </div>
              )
              :
              (
                <div className='mt-3 flex-1 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 custom-scrollbar pr-2'>
                  <div className='reset-tw'>
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
              )
          }

        </div>

      </div>
    </Protect>
  )
}

export default ReviewResume;