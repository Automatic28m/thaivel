import React from 'react'
import CarouselComponent from './CarouselComponent'
import HorizontalRule from './HorizontalRule'
import Image from 'next/image'

function RecommendAttractions() {
    return (
        <section id="close_to_bangkok_place" className="h-fit bg-secondary relative">
            <div className="max-w-5xl m-auto px-3 py-30">
                <div className="">
                    <span className="text-4xl md:text-6xl text-primary uppercase font-serif">
                        recommended attractions
                    </span>
                    <HorizontalRule borderColor='border-primary' />
                </div>
                <CarouselComponent />
            </div>
            <div className="hidden md:flex absolute bottom-[20%] left-[15%] w-[150px] h-[150px] pointer-events-none">
                <Image
                    src="/images/stickers/siamese_cat_happy.png"
                    alt="Detailed decorative ceremonial staff with gold finial and lotus base"
                    fill
                    className="object-contain object-bottom"
                    priority={true} // Priority since it's above the fold on larger screens
                />
            </div>
        </section>
    )
}

export default RecommendAttractions