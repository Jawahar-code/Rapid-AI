import { Scissors, Sparkles, Download, Crown } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Protect from '../components/Protect';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const { plan, fetchUsageAndPlan } = useOutletContext();
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()
  const navigate = useNavigate()
  const timestamp = useMemo(() => Date.now(), []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if (object.split(' ').length > 1) {
        return toast('Please enter only one object name!')
      }

      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)

      const { data } = await axios.post('/api/ai/remove-object', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Object removed successfully!')
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
    <Protect 
      condition={plan === 'premium'}
      fallback={
        <div className='flex-1 h-full flex items-center justify-center p-6'>
          <div className='max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl text-center'>
            <div className='w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#4A7AFF]'>
              <Crown className='w-10 h-10 fill-current' />
            </div>
            <h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-3'>Premium Tool</h2>
            <p className='text-slate-500 dark:text-slate-400 mb-8'>Magic Eraser is an advanced feature reserved for Premium users. Upgrade now to remove any object from your photos instantly.</p>
            <button 
              onClick={() => navigate('/ai/settings')}
              className='w-full py-3 bg-linear-to-r from-[#4A7AFF] to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all cursor-pointer'
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
            <Sparkles className='w-6 text-[#5C6AF1]' />
            <h1 className='text-xl font-semibold dark:text-white'>Object Removal</h1>
          </div>
          <p className='text-sm font-medium dark:text-slate-300'>Upload Image</p>

          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept='image/*'
            className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-transparent file:font-medium file:border-0 file:bg-[#5C6AF1] file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-indigo-600 transition-all'
            required
          />

          <p className='text-xs text-gray-500 dark:text-slate-400 font-light mt-2'>Supports JPG, PNG, and other image formats</p>

          <p className='mt-6 text-sm font-medium dark:text-slate-300'>Describe object name to remove</p>

          <textarea onChange={(e) => setObject(e.target.value)} value={object} rows={4} className='w-full p-2.5 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white' placeholder='e.g., watch or spoon, Only single object name' required />

          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#5C6AF1] to-[#427DF5] hover:shadow-lg hover:shadow-indigo-500/30 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all'>
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-white border-r-transparent animate-spin'></span>
                : <Scissors className='w-5' />
            }
            Remove Object
          </button>
        </form>

        {/* right col */}
        <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
          <div className='flex items-center gap-3'>
            <Scissors className='w-5 h-5 text-[#5C6AF1]' />
            <h1 className='text-xl font-semibold dark:text-white'>Processed Image</h1>
          </div>

          <hr className='mt-4 mb-2 border-gray-200 dark:border-slate-700 shrink-0' />

          {
            !content ?
              (
                <div className='flex-1 flex justify-center items-center min-h-[300px]'>
                  <div className='text-sm flex flex-col items-center gap-5 text-gray-400 dark:text-slate-500'>
                    <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800'>
                      <Scissors className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                    </div>
                    <p className='text-center'>Upload an image and click on "Remove Object" to get started</p>
                  </div>
                </div>
              )
              :
              (
                <div className='mt-3 flex-1 flex items-center justify-center relative group overflow-y-auto custom-scrollbar'>
                  <img src={content} alt="Processed UI" className='max-w-full max-h-[60vh] object-contain rounded-lg shadow-md border border-slate-200 dark:border-slate-700' />
                  <a 
                      href={content} 
                      download={`rapidai_removed-object_${timestamp}.png`}
                      className='absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all font-medium flex gap-2 items-center text-sm shadow-xl cursor-pointer'
                  >
                      <Download className='w-4 h-4' /> Download HD
                  </a>
                </div>
              )
          }
        </div>
      </div>
    </Protect>
  )
}

export default RemoveObject;