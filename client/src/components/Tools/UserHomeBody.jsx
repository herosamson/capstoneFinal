import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Pic1 from '../../assets/images/pic1.jpg';
import Pic2 from '../../assets/images/pic2.jpg';
import Pic3 from '../../assets/images/pic3.jpg';
import Pic4 from '../../assets/images/pic4.jpg';
import Quiapo from '../../assets/images/quaipo.jpg';
import Nazareno from '../../assets/images/nazareno.jpg';

const HomeBody = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        Pic1, 
        Pic2,
        Pic3,
        Pic4,
    ];
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="">
            <div className="w-full h-[100vh] relative max-lg:h-[70vh] max-md:h-[50vh]">
                <img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt="" 
                    className='h-full w-full duration-500 ease-in-out opacity-0 transition-opacity' 
                    onLoad={(e) => { e.target.classList.remove('opacity-0')}}
                />
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute inset-0 flex flex-col justify-center ml-10 text-white">
                    <p className="text-7xl font-bold max-xl:text-5xl max-md:text-3xl">LEAVE NO ONE BEHIND!</p>
                    <p className='text-semibold text-2xl mt-2 max-md:text-lg'>Help Affected Communities Around Philippines.</p>
                    <Link to='/cashothers' className=' mt-4 text-black py-3 font-medium rounded-md bg-yellow-300 hover:scale-105 hover:bg-yellow-400 duration-200 w-40 text-center max-md:py-2'>Donate now</Link>
                </div>
            </div>

            <div className="flex flex-col my-20 mx-48 space-y-28 max-xl:mx-32 max-lg:mx-20 max-sm:space-y-4">
                <div className="flex space-x-16 max-lg:space-x-8 max-sm:flex max-sm:flex-col-reverse max-sm:space-x-0">
                    <div className="w-1/2 my-auto space-y-4 max-md:space-y-2 max-sm:w-full max-sm:mt-4">
                        <div className='flex max-lg:text-2xl space-x-4'>
                            <div className='h-1 w-8 bg-red-400 my-auto rounded-lg'></div>
                            <span className='text-2xl font-semibold text-red-500 '>Mission</span>
                        </div>
                        <p className='indent-8 max-lg:text-base max-lg:indent-4'>
                            “A people called by the Father in Jesus Christ to be a community of persons with
                            Fullness of Life witnessing to the Kingdom of God by living the Paschal Mystery in
                            the power of the Holy Spirit with Mary as Companion.”
                        </p>
                    </div>
                    <img src={Quiapo} alt="" className='w-1/2 h-[40vh] max-lg:h-[30vh] max-sm:w-full'/>
                </div>

                <div className="flex space-x-16 max-lg:space-x-8 max-sm:flex max-sm:flex-col max-sm:space-x-0">
                    <img src={Nazareno} alt="" className='w-1/2 h-[40vh] max-lg:h-[30vh] max-sm:w-full'/>
                    <div className="w-1/2 my-auto space-y-4 max-md:space-y-2 max-sm:w-full max-sm:mt-4">
                        <div className='flex max-lg:text-2xl space-x-4'>
                            <div className='h-1 w-8 bg-red-400 my-auto rounded-lg'></div>
                            <span className='text-2xl font-semibold text-red-500 '>Vision</span>
                        </div>
                        <p className='indent-8 max-lg:text-base max-lg:indent-4'>
                            “Bayang tinawag ng Ama kay Hesukristo upang maging sambayanan ng mga 
                            taong may kaganapan buhay, sumasaksi sa paghahari ng Diyos, nagsasabuhay 
                            ng misteryo paskal, sa kapangyarihan ng Espiritu Santo, kasama ng Mahal na Ina, ang Birheng Maria.”
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeBody
