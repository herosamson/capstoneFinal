import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import Footer from '../../components/Tools/Footer';

const AboutUs = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen); 
    };

    return (
        <div className="font-Poppins min-h-screen flex flex-col">
            <div className={`flex justify-between py-3 px-6 font-Poppins bg-red-800 `}>
                <div className="logo">
                    <img src={Logo} alt="Logo" className='h-auto w-48' />
                </div>
                <div className="flex text-white my-auto">
                    <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
                        &#9776;
                    </div>
                    <div className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-8 max-sm:text-lg max-sm:space-y-3 ${isOpen ? 'max-sm:flex z-10' : 'max-sm:hidden'}`}>
                        <Link className='nav' to="/">Home</Link>
                        <Link className='nav' to="/events">Events</Link>
                        <Link className='nav' to="/about">About us</Link>
                        <Link className='nav' to="/login">Login</Link>
                    </div>
                </div>
            </div>

            <div className="py-8 px-72 flex flex-col flex-grow max-2xl:px-52 max-xl:px-40 max-lg:px-20 max-md:px-12">
                <div className="space-y-8"> 
                    <h2 className='text-center text-3xl font-medium max-md:text-2xl'>Brief history of the Black Nazarene and Quiapo Church</h2>
                        <div className="space-y-6 border-l-2 pl-6">
                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1603</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        The church made of nipa and bamboo was easily gutted by fire at the height of the Chinese rebellion.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md -2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1606</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                    The statue, entrusted to an unknown Recollect priest, was brought across the Pacific Ocean in the hold of a Galleon which arrived in Manila at an undetermined date. They brought with them a dark image of Jesus Christ, upright but kneeling on one knee and carrying a large wooden cross from Mexico. The dark portrayal of Christ reflected the native culture of its Mexican sculpture. The image was enshrined in the first church of the Recoletos at Bagumbayan (Luneta) with St. John the Baptist as patron. The image became known as the Black Nazarene.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1929</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        Huge fire burned down the church.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1933</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        Fr. Magdaleno Castillo started the reconstruction of the church. The famous architect and National Artist, Don Juan Nakpil designed and supervised the construction with the help of Doña Encarnacion Orense in raising funds for the project.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1945</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        Quiapo Church survived the ravage of World War II bombings. The image of Our Lady of Peace and Good Voyage (Antipolo) sought refuge in Quiapo in the midst of the war.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1984</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        The expansion of the church was initiated by Msgr. Jose Abriol to accommodate the growing population of the devotees. The project was under the supervision of Architect Jose Ma. Zaragoza and Engr. Eduardo Santiago.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1987</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        In September 28, 1987, His Eminence, Jaime Cardinal Sin blessed the newly remodeled church and sought recognition of the church as a Basilica.
                                        In December 11, 1987, His Holiness, Pope John Paul II granted the recognition of Quiapo Church as the Minor Basilica of the Black Nazarene because of its role in strengthening a deep popular devotion to Jesus Christ and its cultural contribution to the religiosity of the Filipino people.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">1986</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        In 1989, through the generosity of the people of Quiapo and Devotees of the Nazareno, five bronze bells and three electronic clocks were acquired from Holland.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">2006</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        The celebration of the 400th anniversary of the arrival of the image of the Black Nazarene in Manila.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-6 h-6 border-[#41516a] rounded-full border-4 bg-white absolute -left-9 top-4"></div>
                                <div className="shadow-md overflow-hidden rounded-md border-2">
                                    <p className="border-b-2 py-3 px-6 font-semibold max-sm:text-sm">2009</p>
                                    <p className="py-4 px-6 max-sm:text-sm">
                                        The Traslacion or the observance of the journey of the Black Nazarene’s image from Bagumbayan (Luneta) to Quiapo Church started during this year’s celebration of the Black Nazarene’s Fiesta.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>   
                </div>
            <Footer/>
          </div>
      );
}

export default AboutUs
