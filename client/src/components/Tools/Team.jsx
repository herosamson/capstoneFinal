import React from 'react';
import Cob from '../../assets/images/cob1.png';
import Hero from '../../assets/images/hero.png';
import Dell from '../../assets/images/dell.png';
import Ulay from '../../assets/images/ulay.png';

const Team = () => {
    return (
            <div className="space-y-8">
                <h1 className='text-center font-bold text-5xl text-red-700'>Our Team</h1>
                <div className="flex justify-center space-x-8 max-md:flex-col max-md:space-x-0 max-md:items-center max-md:space-y-8 max-lg:px-4">
                    
                    <div className="flex w-[36%] space-x-8 max-md:flex max-md:justify-center max-md:space-x-12 max-lg:w-[50%] max-md:w-[80%]">
                        <div className="w-1/2 max-md:w-[40%]">
                            <img src={Dell} alt="" className='h-[38vh] w-full bg-[#d2e3d9] rounded-xl mb-4 max-lg:h-[30vh] max-md:h-[30vh]' />
                            <div>
                                <p className="text-lg font-medium">Wendell Castro</p>
                                <p>Project Manager</p>
                                <p className="text-sm mt-4 text-gray-600">
                                    Managed the project and the team to make sure everything is completed on time.
                                </p>
                            </div>
                        </div>

                        <div className="w-1/2 space-x-4 max-md:w-[40%]">
                            <img src={Cob} alt="" className='h-[38vh] w-full bg-[#e5dece] rounded-xl mb-4 max-lg:h-[30vh] max-md:h-[30vh]' />
                            <div>
                                <p className="text-lg font-medium">Jacob Elchico</p>
                                <p>Web Developer</p>
                                <p className="text-sm mt-4 text-gray-600">
                                    Built the website's features and functionalities, ensuring a better user experience.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="flex w-[36%] space-x-8 max-md:flex max-md:justify-center max-md:space-x-12 max-lg:w-[50%] max-md:w-[80%]">
                        <div className="w-1/2 max-md:w-[40%]">
                            <img src={Hero} alt="" className='h-[38vh] w-full bg-[#e5dece] rounded-xl mb-4 max-lg:h-[30vh] max-md:h-[30vh]' />
                            <div>
                                <p className="text-lg font-medium">Hendric Samson</p>
                                <p>Mobile Developer</p>
                                <p className="text-sm mt-4 text-gray-600">
                                    Focused on making an efficient and easy-to-use mobile application for Android devices.
                                </p>
                            </div>
                        </div>

                        <div className="w-1/2 max-md:w-[40%]">
                            <img src={Ulay} alt="" className='h-[38vh] w-full bg-[#e5dece] rounded-xl mb-4 max-lg:h-[30vh] max-md:h-[30vh]' />
                            <div>
                                <p className="text-lg font-medium">Hendric Samson</p>
                                <p>Documentation</p>
                                <p className="text-sm mt-4 text-gray-600">
                                    Keeps all progress and the project documented and organized.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Team
