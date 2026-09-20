import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'


const Ai_Tools = () => {

  const navigate = useNavigate()
  const { user } = useUser()
  return (
    <div className='px-4 sm:px-20 xl:px-32 mt-10 mb-24'>
      <div className='text-center'>
        <h2 className='text-slate-700 dark:text-white text-[42px] font-semibold'>Powerful AI Tools</h2>
        <p className='text-gray-500 dark:text-slate-400 max-w-lg mx-auto'>Everything you need to create, enhance and optimize your content with cutting-edge AI technology.</p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index) => (
          <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={() => user && navigate(tool.path)}>

            <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{ background: `linear-gradient(to bottom,${tool.bg.from},${tool.bg.to})` }} />

            <div className='mt-6 mb-3 flex items-center justify-between gap-3'>
              <h3 className='text-lg font-semibold dark:text-white'>{tool.title}</h3>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${tool.access === 'Free' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300'}`}>
                {tool.access}
              </span>
            </div>
            <p className='text-gray-400 dark:text-slate-400 text-sm max-w-[95%]'>{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ai_Tools