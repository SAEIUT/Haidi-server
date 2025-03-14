import React from 'react'
import Navbar from '../components/navbar'
import { Link } from 'react-router-dom'

import { FiArrowRight, FiMail } from 'react-icons/fi'

import { TypeAnimation } from 'react-type-animation';

import Screenshot from '../components/screenshot'
import Faq from '../components/faq'
import Download from '../components/download'
import Contact from '../components/contact'
import Footer from '../components/footer'

export default function IndexTwo() {
  return (
    <>
    <Navbar navLight={false} playBtn={false} bgLight={false} navCenter={false}/>

    <section className="relative overflow-hidden pt-40 after:content-[''] after:absolute after:inset-0 after:mx-auto after:size-[56rem] after:bg-gradient-to-tl after:to-red-600/40  after:from-indigo-600/40 after:blur-[200px] after:rounded-full after:-z-1" id="home">
        <div className="container relative z-2">
            <div className="grid grid-cols-1 text-center">
                <div className="">
                    <h4 className="lg:leading-normal leading-normal text-4xl lg:text-[54px] mb-5">Awesome Mobile App for Your <br/> 
                    <TypeAnimation
                        sequence={[
                            // Same substring at the start will only be typed out once, initially
                            'Business',
                            1000, // wait 1s before replacing "Mice" with "Hamsters"
                            'Modern Lifestyle',
                            1000,
                            'Social Media',
                            1000,
                        ]}
                        wrapper="span"
                        speed={20}
                        repeat={Infinity}
                        className="typewrite font-bold"
                        cursor={false}
                        />
                    </h4>
                    <p className="text-slate-500 dark:text-white/60 text-lg max-w-xl mx-auto">Gain valuable insights into user behavior and drive data-informed decision-making with our revolutionary platform.</p>

                    <div className="subcribe-form mt-6 mb-3">
                        <form className="relative max-w-lg mx-auto">
                            <FiMail className="size-4 absolute top-[17px] start-5 text-slate-400"/>
                            <input type="email" id="subcribe" name="email" className="form-input border-0 py-4 ps-12 pe-12 w-full h-[50px] outline-none text-black dark:text-white rounded-full bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 focus:border-0 focus:ring-0" placeholder="Your Email Address :"/>
                            <button type="submit" className="size-[46px] inline-flex items-center justify-center rounded-full align-middle absolute top-[2px] end-[3px] bg-red-500 border-red-500 text-white"><FiArrowRight className="size-5"/></button>
                        </form>
                    </div>

                    <span className="text-slate-500 dark:text-white/60 font-medium">Looking for help? <Link to="" className="text-red-500">Get in touch with us</Link></span>
                </div>
            </div>
        </div>
    </section>

    <section className="relative md:py-24 py-16" id="features">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Features</h6>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">Discover Powerful Features</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Benefit from an intuitive and accessible interface designed to simplify travel and meet the needs of people with reduced mobility.</p>
            </div>

        </div>
    </section>

    <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="screenshot">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Screenshots</h6>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">Simple & Beautiful Interface</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Benefit from an intuitive and accessible interface designed to simplify travel and meet the needs of people with reduced mobility.</p>
            </div>

            <Screenshot/>
        </div>
    </section>

    <section className="relative overflow-hidden md:py-24 py-16" id="faqs">
        <Faq/>
    </section>

    <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="download">
        <Download/>
    </section>

    <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="contact">
        <Contact/>
    </section>


    <Footer/>

    </>
  )
}
