'use client'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Effect } from '../components/animate/Effect'


export default function Contact() {
    return (
        <main className="bg-secondary pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-6">

                {/* 1. Header Section */}
                <Effect fade slide={{ direction: 'up', offset: 20 }}>
                    <h1 className="text-primary font-serif text-5xl md:text-7xl uppercase leading-tight mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-primary/60 font-serif text-lg max-w-xl mb-12">
                        Whether you're planning your next journey to a serene temple or a modern cafe, we're here to help you navigate Thailand.
                    </p>
                </Effect>

                <div className="grid md:grid-cols-2 gap-12 mt-12">

                    {/* 2. Contact Information */}
                    <Effect fade delay={200} className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </div>
                            <div>
                                <h3 className="font-serif uppercase tracking-widest text-sm text-primary/40">Location</h3>
                                <p className="text-primary text-lg">Pathum Thani, Thailand</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <div>
                                <h3 className="font-serif uppercase tracking-widest text-sm text-primary/40">Email</h3>
                                <p className="text-primary text-lg">phanlop.auto@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <div>
                                <h3 className="font-serif uppercase tracking-widest text-sm text-primary/40">Phone</h3>
                                <p className="text-primary text-lg">+6699 015 0026</p>
                            </div>
                        </div>
                    </Effect>

                    {/* 3. Simple Message Form */}
                    <Effect fade delay={400}>
                        <form className="space-y-6">
                            <div>
                                <label className="block font-serif text-xs uppercase tracking-widest text-primary/40 mb-2">Name</label>
                                <input type="text" className="w-full bg-transparent border-b border-primary/20 py-2 focus:border-primary outline-none transition-colors text-primary" />
                            </div>
                            <div>
                                <label className="block font-serif text-xs uppercase tracking-widest text-primary/40 mb-2">Message</label>
                                <textarea rows="4" className="w-full bg-transparent border-b border-primary/20 py-2 focus:border-primary outline-none transition-colors text-primary resize-none" />
                            </div>
                            <button className="bg-primary text-secondary font-serif uppercase tracking-widest px-8 py-3 hover:bg-primary/90 transition-all duration-300">
                                Send Message
                            </button>
                        </form>
                    </Effect>
                </div>
            </div>
        </main>
    )
}