import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import PdfSummarizer from './pages/PdfSummarizer'
import ReviewResume from './pages/ReviewResume'
import ResumeJobMatch from './pages/ResumeJobMatch'
import DocumentAnalyzer from './pages/DocumentAnalyzer'
import ContentSeoAnalyzer from './pages/ContentSeoAnalyzer'
import ResumeWorkspace from './pages/ResumeWorkspace'
import ContentWorkspace from './pages/ContentWorkspace'
import Community from './pages/Community'
import Settings from './pages/Settings'
import { useAuth } from '@clerk/react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast';
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
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='content-tools' element={<ContentWorkspace />}>
            <Route index element={<Navigate to='article' replace />} />
            <Route path='article' element={<WriteArticle />} />
            <Route path='titles' element={<BlogTitles />} />
          </Route>
          <Route path='write-article' element={<Navigate to='/ai/content-tools/article' replace />} />
          <Route path='blog-titles' element={<Navigate to='/ai/content-tools/titles' replace />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='pdf-summarizer' element={<PdfSummarizer />} />
          <Route path='resume-tools' element={<ResumeWorkspace />}>
            <Route index element={<Navigate to='review' replace />} />
            <Route path='review' element={<ReviewResume />} />
            <Route path='match' element={<ResumeJobMatch />} />
          </Route>
          <Route path='review-resume' element={<Navigate to='/ai/resume-tools/review' replace />} />
          <Route path='resume-job-match' element={<Navigate to='/ai/resume-tools/match' replace />} />
          <Route path='document-analyzer' element={<DocumentAnalyzer />} />
          <Route path='content-seo-analyzer' element={<ContentSeoAnalyzer />} />
          <Route path='community' element={<Community />} />
          <Route path='settings' element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
