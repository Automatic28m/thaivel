import React from 'react'
import CarouselComponent from './CarouselComponent'
import HorizontalRule from './HorizontalRule'

function RecommendAttractions() {
    return (
        <section id="close_to_bangkok_place" className="h-fit bg-secondary">
            <div className="max-w-5xl m-auto px-3 py-30">
                <div className="">
                    <span className="text-4xl md:text-6xl text-primary uppercase font-serif">
                        recommended attractions
                    </span>
                    <HorizontalRule borderColor='border-primary' />
                </div>
                <CarouselComponent />
            </div>
        </section>
    )
}

export default RecommendAttractions