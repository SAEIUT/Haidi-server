import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronUp } from 'react-icons/fi';
import faqImg from '../assets/images/phone/2.png';
import { faq } from '../data/data';


export default function Faq() {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <div className="container relative">
            <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-[30px]">
                {/* Section Image */}
                <div className="relative order-1 md:order-2">
                    <img src={faqImg} className="mx-auto md:max-w-xs lg:max-w-sm" alt="FAQ" />
                    
                    {/* Bouton Play */}
                    <div className="absolute top-24 md:end-14 -end-2 text-center">
                        <button 
                            onClick={() => setOpen(true)} 
                            className="size-20 rounded-full shadow-md dark:shadow-gray-700 inline-flex items-center justify-center text-white bg-red-500"
                        >
                            <i className="mdi mdi-play text-2xl"></i>
                        </button>
                    </div>

                    {/* Modal Vidéo */}
                    {isOpen && (
                        <div 
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            onClick={() => setOpen(false)}
                        >
                            <div 
                                className="bg-white p-5 rounded-lg max-w-xl mx-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <video controls className="w-full">
                                    <source src="https://cdn.discordapp.com/attachments/1283000631485005848/1333611813165596673/MAIN.mp4?ex=67998649&is=679834c9&hm=5ae70cc72d835c1fe76893647ae322e955162595c116af88feee38eee80182c5&" type="video/mp4" />
                                    Votre navigateur ne supporte pas la lecture de vidéos.
                                </video>
                                <button 
                                    onClick={() => setOpen(false)} 
                                    className="mt-3 text-red-500 font-bold"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section FAQ */}
                <div className="lg:me-8 order-2 md:order-1">
                    <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">FAQs</h6>
                    <h4 className="mb-6 md:text-3xl text-2xl font-bold">Have Questions? Look Here</h4>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Benefit from an intuitive and accessible interface designed to simplify travel and meet the needs of people with reduced mobility.
                    </p>

                    {/* Liste des questions */}
                    <div className="mt-8">
                        {faq.map((item) => (
                            <div key={item.id} className={`shadow dark:shadow-gray-800 rounded-md overflow-hidden ${item.id !== 1 ? 'mt-3' : ''}`}>
                                <h2 className="font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex justify-between items-center p-5 w-full text-start ${activeTab === item.id ? 'bg-slate-50 dark:bg-slate-800 text-red-500' : ''}`}
                                    >
                                        <span>{item.title}</span>
                                        <FiChevronUp className={`size-4 transition-transform ${activeTab === item.id ? '' : 'rotate-180'}`} />
                                    </button>
                                </h2>
                                {activeTab === item.id && (
                                    <div className="p-5">
                                        <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Link to="#" className="hover:text-red-500 dark:hover:text-red-500 transition duration-500 font-medium">
                            Find Out More <i className="mdi mdi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}