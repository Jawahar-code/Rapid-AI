import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Ai_Tools from '../components/Ai_Tools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'


const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Ai_Tools />
            <Testimonial />
            <Plan />
            <Footer />
        </>
    )
}

export default Home