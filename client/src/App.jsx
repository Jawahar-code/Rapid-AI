import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout  from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import PdfSummarizer from './pages/PdfSummarizer'
import Community from './pages/Community'
import Settings from './pages/Settings'
import { useAuth } from '@clerk/react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';

const App = () => {
   const { theme } = useTheme();

  return (
    <div className='bg-white dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300'>
      <Toaster 
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
          }
        }} 
      />
      <Routes>
        <Route path='/' element={<Home />}/> 
        <Route path='/ai' element={<Layout />}>
          <Route  index element={<Dashboard/>} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='pdf-summarizer' element={<PdfSummarizer />} />
          <Route path='community' element={<Community />} />
          <Route path='settings' element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
