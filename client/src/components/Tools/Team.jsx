import React from 'react';
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';

const Team = () => {
    return (
        <div className="space-y-8">
            <h1 className='text-center font-bold text-5xl text-red-700'>Featured Articles</h1>

            <div className="flex justify-center space-x-12 max-md:flex-col max-md:space-x-0 max-md:items-center max-md:space-y-12 max-lg:px-4">
                
                <div className="w-[36%] flex flex-col items-center text-center max-lg:w-[50%] max-md:w-[80%]">
                    <img src={img2} alt="image1" 
                        className="h-[38vh] w-full bg-[#e5dece] rounded-xl mb-4 max-lg:h-[30vh] max-md:h-[30vh]" 
                    />
                    <p className="text-lg font-medium">The Nazareno Spirituality: Every Devotee’s Way of Life</p>
                    <p className="text-sm mt-4 text-gray-600">
                    “Whereas other images are fair-skinned, this image of the Lord as the Nazareno stands out as being 
                    moreno (Filipino-skinned), kneeling, and carrying a cross. Perhaps it is in the Nazareno that the Filipino 
                    first sees himself: replete with pain, suffering, and with a cross to carry. In him, the multitudes who pray
                    in Quiapo Church — most of whom are weighed down by life’s burdens — someone who understands and shares in their
                    sufferings. In this image, it is as if the faithful believers hear God speaking to them: “You are not alone,” or 
                    “I know what you are experiencing,” or “Tell me what is weighing you down, and I will help you carry it.” Landas 
                    ng Pagpapakabanal, CBCP Pastoral Letter on Filipino Spirituality (2000)
                    </p>
                </div>

                <div className="w-[36%] flex flex-col items-center text-center max-lg:w-[50%] max-md:w-[80%]">
                    <img src={img1} alt="image2" 
                        className="h-[38vh] w-full bg-[#e5dece] rounded-xl mb-4 max-lg:h-[30vh] max-md:h-[30vh]" 
                    />
                    <p className="text-lg font-medium">The Home of Jesus Nazareno</p>
                    <p className="text-sm mt-4 text-gray-600">
                    On January 29, 2024, Quiapo Church will be officially known as the Minor Basilica and National Shrine of JESUS NAZARENO. Instead of highlighting the color of the image, we give prominence to the Holy Name of Jesus for a variety of reasons:
                    When Quiapo Church was established as a parish in 1588, although the patron is St. John the Baptist, it was dedicated by the Franciscans to the Sweetest Name of Jesus. Long before the Nazareno found its home in this church, it already 
                    bore His mighty name. Not a few liturgists and theologians consider the January 9 feast of the Nazareno as ill-timed as it is celebrated usually during the Christmas season. Rightly perhaps, the cross-bearing image of Jesus may be more
                    appropriate during Lent. But if we will also emphasize His Holy Name, there is no disconnect with the mystery of Incarnation being commemorated.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Team;
