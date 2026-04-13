import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useOutletContext } from 'react-router-dom';
import Markdown from 'react-markdown';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const { fetchUsageAndPlan } = useOutletContext();

  const articleLength = [
    { length: 800, text: 'Short(500-800 words)' },
    { length: 1200, text: 'Medium(800-1200 words)' },
    { length: 1600, text: 'Long(1200+ words)' }
  ]

  const articleTones = [
    { tone: 'casual', text: 'Casual' },
    { tone: 'formal', text: 'Formal' },
    { tone: 'informal', text: 'Informal' },
    { tone: 'humorous', text: 'Humorous' }
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [selectedTone, setSelectedTone] = useState(articleTones[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Write a detailed article about ${input} in ${selectedLength.text} with a ${selectedTone.tone} tone.`

      const { data } = await axios.post('/api/ai/generate-article', { prompt, length: selectedLength.length }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      // ... same success handling ...
      if (data.success) {
        setContent(data.content)
        toast.success('Article generated successfully!')
        fetchUsageAndPlan();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full p-6 flex items-start flex-col lg:flex-row gap-6 text-slate-700 dark:text-slate-200 transition-colors overflow-hidden'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} action="" className='w-full lg:w-[45%] p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm shrink-0'>
        <div className='flex items-center gap-3 mb-6'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold dark:text-white'>Article Configuration</h1>
        </div>
        <p className='text-sm font-medium dark:text-slate-300'>Article Topic</p>

        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" className='w-full p-2.5 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary/20 transition-all dark:text-white' placeholder='Write your article topic here...' required />

        <p className='mt-6 text-sm font-medium dark:text-slate-300'>Article Length</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-[90%]'>
          {articleLength.map((item, index) => (
            <span onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-colors ${selectedLength.text === item.text ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-purple-700/50' : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`} key={index}>{item.text}
            </span>
          ))}
        </div>

        <p className='mt-6 text-sm font-medium dark:text-slate-300'>Article Tone</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-[90%]'>
          {articleTones.map((item, index) => (
            <span onClick={() => setSelectedTone(item)}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-colors ${selectedTone.text === item.text ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-purple-700/50' : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`} key={index}>{item.text}
            </span>
          ))}
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Edit className='w-5' />
          }
          Generate article
        </button>
      </form>


      {/* right col */}
      <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
        <div className='flex items-center gap-3 shrink-0'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold dark:text-white'>Generated Article</h1>
        </div>

        <hr className='mt-4 mb-2 border-gray-200 dark:border-slate-700 shrink-0' />

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 dark:text-slate-500'>
              <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 focus:outline-none'>
                <Edit className='w-12 h-12 text-slate-300 dark:text-slate-600' />
              </div>
              <p>Enter a topic and click on "Generate Article" to get started</p>
            </div>
          </div>
        ) :
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
  )
}

export default WriteArticle