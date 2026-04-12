import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Ai_Tools from '../components/Ai_Tools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'

const Home = () => {
    return (
        <div className="bg-white dark:bg-slate-900 transition-colors">
            <Navbar />
            <Hero />
            <Ai_Tools />
            <Testimonial />
            <Plan />
            <FAQ />
            <Footer />
        </div>
    )
}

export default Home