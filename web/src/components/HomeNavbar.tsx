import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as Link1 } from 'react-scroll';


import { FiUser } from 'react-icons/fi';

export default function HomeNavbar({ navLight, bgLight }: { navLight: boolean, bgLight: boolean }) {
    let [menu, setMenu] = useState<Boolean>(false);
    let [scroll, setScroll] = useState<Boolean>(false);

    useEffect(() => {
        const handlerScroll = () => {
            if (window.scrollY > 50) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        };

        window.addEventListener('scroll', handlerScroll);
        return () => {
            window.removeEventListener('scroll', handlerScroll);
        };
    }, []);

    return (
        <nav className={`navbar ${bgLight ? 'bg-white dark:bg-slate-900 shadow dark:shadow-gray-800' : ''} ${scroll ? 'is-sticky' : ''}`} id="navbar">
            <div className="container relative flex flex-wrap items-center justify-between">

                <div className="nav-icons flex items-center lg_992:order-2 md:ms-6">
                    <ul className="list-none menu-social mb-0">
                        <li className="inline">
                            <Link to="/login" className="size-8 inline-flex items-center justify-center rounded-full align-middle bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white"><FiUser className="size-4" /></Link>
                        </li>
                    </ul>
                    <button type="button" className="collapse-btn inline-flex items-center ms-2 text-slate-900 dark:text-white lg_992:hidden" onClick={() => setMenu(!menu)}>
                        <span className="sr-only">Navigation Menu</span>
                        <i className="mdi mdi-menu text-[24px]"></i>
                    </button>
                </div>

                <div className={`navigation lg_992:order-1 lg_992:flex ${menu ? '' : 'hidden'}`} id="menu-collapse">
                    <ul className={`navbar-nav ${navLight ? 'nav-light' : ''}`} id="navbar-navlist">
                        <li className="nav-item ms-0">
                            <Link1 className="nav-link" activeClass="active" spy={true} smooth={true} duration={500} to="home">Home</Link1>
                        </li>
                        <li className="nav-item ms-0">
                            <Link to="/reservation" className="nav-link">Reservation</Link>
                        </li>
                        {/* Ajoutez d'autres liens ici si nécessaire */}
                    </ul>
                </div>
            </div>
        </nav>
    );
}