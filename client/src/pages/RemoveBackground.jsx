import { Eraser, Sparkles, Download } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Background removed successfully!')
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
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold dark:text-white'>Background Removal</h1>
        </div>
        <p className='text-sm font-medium dark:text-slate-300'>Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='image/*'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-transparent file:font-medium file:border-0 file:bg-primary file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-indigo-600 transition-all'
          required
        />

        <p className='text-xs text-gray-500 dark:text-slate-400 font-light mt-2'>Supports JPG, PNG, and other image formats</p>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/30 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-white border-r-transparent animate-spin'></span>
              :
              <Eraser className='w-5' />
          }

          Remove Background
        </button>
      </form>

      {/* right col */}
      <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-xl font-semibold dark:text-white'>Processed Image</h1>
        </div>

        <hr className='mt-4 mb-2 border-gray-200 dark:border-slate-700 shrink-0' />

        {
          !content ?
            (
              <div className='flex-1 flex justify-center items-center min-h-[300px]'>
                <div className='text-sm flex flex-col items-center gap-5 text-gray-400 dark:text-slate-500'>
                  <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800'>
                     <Eraser className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                  </div>
                  <p className='text-center'>Upload an image and click on "Remove Background" to get started</p>
                </div>
              </div>
            ) :
            (
              <div className='mt-3 flex-1 flex items-center justify-center relative group min-h-[300px] overflow-y-auto custom-scrollbar'>
                {/* Checkered background to emphasize transparency */}
                <div className='absolute inset-0 rounded-lg pointer-events-none' style={{ backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px', opacity: 0.2 }}></div>
                <img src={content} alt="Processed Image" className='max-w-full max-h-[60vh] object-contain relative z-10 rounded-lg' />
                <a 
                    href={content} 
                    download={`rapidai_no-bg_${Date.now()}.png`}
                    className='absolute bottom-4 right-4 z-20 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all font-medium flex gap-2 items-center text-sm shadow-xl cursor-pointer'
                >
                    <Download className='w-4 h-4' /> Download PNG
                </a>
              </div>
            )
        }

      </div>
    </div>
  )
}

export default RemoveBackground