import { Hash, Sparkles, Copy, Download, Check } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/react';
import Markdown from 'react-markdown';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'LifeStyle', 'Education', 'Travel', 'Food'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)

  const { getToken } = useAuth()

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `rapidai_blog_titles_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      const prompt = `Generate a blog titles (around ) for the keyword "${input}" in the category "${selectedCategory}".`;

      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Titles generated successfully!')
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
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold dark:text-white'>AI Title Generator</h1>
        </div>
        <p className='text-sm font-medium dark:text-slate-300'>Keyword</p>

        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" className='w-full p-2.5 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary/20 transition-all dark:text-white' placeholder='Write your keyword here...' required />

        <p className='mt-6 text-sm font-medium dark:text-slate-300'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-10/11'>
          {blogCategories.map((item) => (
            <span onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-colors ${selectedCategory === item ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700/50' : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`} key={item}>{item}
            </span>
          ))}
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/30 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all disabled:opacity-70'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-white border-r-transparent animate-spin'></span> : <Hash className='w-5' />
          }
          Generate Titles
        </button>
      </form>

      {/* right col */}
      <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold dark:text-white'>Generated Titles</h1>
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
                    <Hash className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                  </div>
                  <p>Enter a keyword and click on "Generate Titles" to get started</p>
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

export default BlogTitles