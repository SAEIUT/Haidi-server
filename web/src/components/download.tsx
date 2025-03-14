import React from 'react';
import { Link } from 'react-router-dom';
import app from '../assets/images/app.png';
import play from '../assets/images/play.png';
import phone from '../assets/images/phone/half-3.png';
import { FiSmartphone } from 'react-icons/fi';

export default function Download() {
    const SmartphoneIcon = FiSmartphone as React.ElementType;

    return (
        <div className="container relative">
            <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                <div className="lg:col-span-5 md:col-span-6">
                    <div className="pt-6 px-6 rounded-2xl bg-red-500/5 dark:bg-red-500/10 shadow shadow-red-500/20">
                        <img src={phone} alt="" />
                    </div>
                </div>

                <div className="lg:col-span-7 md:col-span-6">
                    <div className="lg:ms-10">
                        <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Mobile Apps</h6>
                        <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">Available for your <br /> Smartphones</h4>
                        <p className="text-slate-400 max-w-xl mb-0">Benefit from an intuitive and accessible interface designed to simplify travel and meet the needs of people with reduced mobility.</p>
                        <div className="my-6">
                            <Link to="#"><img src={app} className="h-12 inline-block m-1" alt="" /></Link>
                            <Link to="#"><img src={play} className="h-12 inline-block m-1" alt="" /></Link>
                        </div>

                        <div className="inline-block">
                            <div className="pt-4 flex items-center border-t border-gray-100 dark:border-gray-800">
                                <SmartphoneIcon className="me-2 text-red-500 size-10" />
                                <div className="content">
                                    <h6 className="text-base font-medium">Install app now on your cellphones</h6>
                                    <Link to="#" className="hover:text-red-500 dark:hover:text-red-500 after:bg-red-500 dark:text-white transition duration-500 font-medium">Install Now <i className="mdi mdi-arrow-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}