import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import logo from '../assets/blockchain.png';
import cart from '../assets/shopping-cart.png';
import search from '../assets/search.png';
import dropdown from "../assets/down-arrow.png";
import wishlist from '../assets/wishlist.png';

interface UserNavbarProps {
    ImageURl: string;
}

export const UserNavbar: React.FC<UserNavbarProps> = ({ ImageURl }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const categories = useSelector((state: RootState) => state.category.categories);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="fixed w-full h-16 font-roboto px-4 md:px-8 lg:px-16 border-b border-indigo_dye-300 bg-ghost_white-500 z-50">
            <div className='flex justify-between items-center h-full'>
                {/* Logo */}
                <NavLink to="" className='flex items-center'>
                    <img src={logo} alt="Gizmo logo" className='w-8 md:w-10' />
                    <span className='text-lg md:text-xl font-medium text-rich_black ml-2'>Gizmo</span>
                </NavLink>

                {/* Center Section */}
                <div className='hidden md:flex justify-center items-center space-x-4 ml-6'>
                    <NavLink to="" className='text-base text-black hover:opacity-70 transition-colors duration-300'>Home</NavLink>
                    <div className='relative' ref={dropdownRef}>
                        <button
                            className='flex items-center gap-1 text-base text-black hover:opacity-70 transition-colors duration-300'
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        >
                            All Categories
                            <img src={dropdown} alt="Dropdown arrow" className={`w-4 transition-transform duration-300 ${isCategoryOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                        {isCategoryOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50">
                                {categories.map((category: any) => (
                                    <NavLink
                                        key={category.CategoryId}
                                        to={`/category/${category.CategoryId}`}
                                        className="block px-4 py-2 text-sm text-ghost_white-900 hover:bg-ghost_white hover:text-black transition-colors duration-300"
                                    >
                                        {category.CategoryName}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className='bg-black text-ghost_white rounded-lg h-9 px-4 hover:bg-ghost_white-900 hover:text-black border-black border-2 hover:border-black transition-colors duration-300 ease-in-out active:opacity-50'>
                        Become a Seller
                    </button>
                </div>

                {/* Right Section */}
                <div className='flex items-center space-x-4 md:space-x-2'>
                    <div className='relative' ref={searchRef}>
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className='p-2 hover:bg-ghost_white-900 rounded-full transition-colors duration-300'
                        >
                            <img src={search} alt="Search" className='w-5 h-5' />
                        </button>
                        {isSearchOpen && (
                            <div className='absolute right-0 mt-2 w-72 bg-ghost_white rounded-md shadow-lg p-2'>
                                <input
                                    type='text'
                                    placeholder='Search for a product'
                                    className='w-full h-9 px-3 outline-none rounded-lg border border-indigo_dye-300 focus:border-black focus:ring-1 focus:ring-black transition-all duration-300'
                                />
                            </div>
                        )}
                    </div>
                    <NavLink to="/wishlist" className='p-2 hover:bg-ghost_white-900 rounded-full transition-colors duration-300'>
                        <img src={wishlist} alt="Wishlist" className='w-5 h-5' />
                    </NavLink>
                    <NavLink to="/cart" className='p-2 hover:bg-ghost_white-900 rounded-full transition-colors duration-300'>
                        <img src={cart} alt="Shopping cart" className='w-5 h-5' />
                    </NavLink>
                    <div className="relative">
                        <div
                            className="relative"
                            onMouseEnter={() => setIsOpen(true)}
                            onMouseLeave={() => setIsOpen(false)}
                        >
                            <button className='flex items-center space-x-1 p-1 hover:bg-ghost_white-900 rounded-full transition-colors duration-300'>
                                <img
                                    src={ImageURl}
                                    alt="User profile"
                                    className="rounded-full w-7 h-7"
                                />
                                <img src={dropdown} alt="Dropdown arrow" className='w-4 h-4'/>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 w-48 bg-rich_black rounded-md shadow-lg py-1 z-50">
                                    {['Profile', 'Settings', 'Activity Log', 'Help & Support'].map((item) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(/ & /g, '-').replace(' ', '-')}`}
                                            className="block px-4 py-2 text-sm text-ghost_white hover:bg-ghost_white-500 hover:text-rich_black transition-colors duration-300"
                                        >
                                            {item}
                                        </a>
                                    ))}
                                    <NavLink
                                        to="/"
                                        className="block px-4 py-2 text-sm text-ghost_white hover:bg-engineering_orange-700 hover:text-ghost_white-500 transition-colors duration-300"
                                    >
                                        Logout
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

