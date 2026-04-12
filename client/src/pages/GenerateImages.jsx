import { Edit, Hash, Image, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {

  const imageStyle = [
    'Realistic Style', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', '3D Style', 'Portrait Style'
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic Style')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      const prompt = `Generate an image on "${input}" in the style of "${selectedStyle}"`;

      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })

      if (data.success) {
        setContent(data.content)
        toast.success('Image generated successfully!')
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
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold dark:text-white'>AI Image Generator</h1>
        </div>
        <p className='text-sm font-medium dark:text-slate-300'>Describe your Image</p>

        <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={4} type="text" className='w-full p-2.5 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary/20 transition-all dark:text-white' placeholder='Describe what you want to see in the image...' required />

        <p className='mt-6 text-sm font-medium dark:text-slate-300'>Style</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-10/11'>
          {imageStyle.map((item) => (
            <span onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-colors ${selectedStyle === item ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700/50' : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`} key={item}>{item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700'>
          <label className='relative cursor-pointer flex items-center gap-2'>
            <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer' />

            <div className='w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer-checked:bg-green-500 transition-colors'></div>
            <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5'></span>
          </label>
          <p className='text-sm dark:text-slate-300 font-medium'>Make this image public <span className='text-xs text-slate-400 font-light block'>Share with the community</span></p>
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/30 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-white border-r-transparent animate-spin'></span>
              : <Image className='w-5' />
          }
          Generate image
        </button>
      </form>

      {/* right col */}
      <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold dark:text-white'>Generated Image</h1>
        </div>

        <hr className='mt-4 mb-2 border-gray-200 dark:border-slate-700 shrink-0' />

        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400 dark:text-slate-500'>
                <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800'>
                    <Image className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                </div>
                <p>Enter a prompt and click on "Generate image" to get started</p>
              </div>
            </div>
          )
            :
            (
              <div className='mt-3 flex-1 flex items-center justify-center relative group overflow-y-auto custom-scrollbar'>
                <img src={content} alt="Generated UI" className='max-w-full max-h-[60vh] object-contain rounded-lg shadow-md border border-slate-200 dark:border-slate-700' />
                <a 
                    href={content} 
                    download={`rapidai_image_${Date.now()}.png`}
                    className='absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all font-medium flex gap-2 items-center text-sm shadow-xl cursor-pointer'
                >
                    <Download className='w-4 h-4' /> Download HD
                </a>
              </div>
            )

        }

      </div>
    </div>
  )
}

export default GenerateImages