import React from 'react'
import { FaFacebookSquare, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";

const Footer = () => {
    return (
        <div className='flex justify-between px-4 items-center border-t-2 text-black/70 text-xl py-2'> 
          <p className='text-sm my-auto'>&copy; 2024 iDonate. All rights reserved.</p>
            <div className="flex space-x-3">
                <a href="https://www.facebook.com/quiapochurch" target="_blank" rel="noopener noreferrer" className='duration-200 hover:text-black'>
                  <FaFacebookSquare />
                </a>

                <a href="https://www.youtube.com/channel/UCk1MtZ7T5SOLrcIhKQw0rnw" target="_blank" rel="noopener noreferrer" className='duration-200 hover:text-black'>
                  <IoLogoYoutube />
                </a>

                <a href="https://www.instagram.com/quiapochurch" target="_blank" rel="noopener noreferrer" className='duration-200 hover:text-black'>
                  <FaInstagram />
                </a>
                <a href="https://www.tiktok.com/@quiapo_church" target="_blank" rel="noopener noreferrer" className='duration-200 hover:text-black'>
                  <FaTiktok />
                </a>
            </div>
        </div>
    )
}

export default Footer
