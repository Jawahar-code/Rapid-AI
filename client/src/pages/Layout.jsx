import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuth, useUser } from '@clerk/react'
import axios from 'axios'

const Layout = () => {

  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()
  const { getToken } = useAuth()
  const [creationsCount, setCreationsCount] = useState(user?.publicMetadata?.free_usage || 0)

  const fetchUsageAndPlan = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreationsCount(data.creations.length)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      setCreationsCount(user?.publicMetadata?.free_usage || 0)
      fetchUsageAndPlan()
    }
  }, [user])

  const isPremium = user?.publicMetadata?.plan === 'premium';
  const remainingCredits = 10 - creationsCount;

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300'>
      <Navbar setSidebar={setSidebar} isPremium={isPremium} remainingCredits={remainingCredits} />
      <div className='flex items-start justify-start w-full h-[calc(100vh-64px)] overflow-hidden'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} isPremium={isPremium} />
        <div className='flex-1 h-full overflow-hidden bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 transition-colors duration-300'>
          <Outlet context={{ isPremium }} />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center w-full h-screen'>
      <p>Loading...</p>
    </div>
  )
}

export default Layout