'use client'
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faUser, faMapLocationDot, faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown';
import Image from 'next/image'

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Sawasdee! I am your Thaivel AI Guide. Tell me what kind of vibe you're looking for.",
            sources: []
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isLoading, isOpen])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userText = input
        setMessages(prev => [...prev, { role: 'user', content: userText }])
        setInput('')
        setIsLoading(true)

        try {
            const response = await axios.post('/api/chat', { message: userText })
            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.data.reply,
                sources: response.data.sources
            }])
            console.log(response);
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I'm having a little trouble accessing the Thaivel database right now. Please try again in a moment."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <div
                className={`mb-4 w-96 max-w-[calc(100vw-2rem)] bg-secondary/60 backdrop-blur-md border border-primary/20 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 h-[600px] max-h-[calc(100vh-8rem)]' : 'scale-0 opacity-0 h-0'}`}
            >
                {/* Widget Header */}
                <div className="bg-primary text-secondary px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* Fix: Added container for the fill image */}
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/stickers/tuktuk_front.png"
                                alt="tuktuk"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-serif tracking-widest uppercase text-sm font-medium">TukTuk Driver ai</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-secondary/60 hover:text-secondary transition-colors"
                        aria-label="Close Chat"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar bg-secondary/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* AI Avatar: Replacing faCat with the sticker */}
                            <div className="shrink-0 mt-1">
                                {msg.role === 'ai' ? (
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-primary/10">
                                        <Image
                                            src="/images/stickers/tuktuk_front.png"
                                            alt="AI Avatar"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-primary text-sm flex items-center justify-center w-6 h-6">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                )}
                            </div>

                            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end text-right' : 'items-start text-left'} `}>
                                <div className="font-serif text-base leading-relaxed text-primary">
                                    <div className="whitespace-pre-wrap prose prose-primary prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                a: ({ node, ...props }) => (
                                                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/60 underline underline-offset-4 decoration-primary/30 transition-colors" />
                                                ),
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2 text-[9px] text-primary/50 uppercase tracking-widest mt-2">
                                        <FontAwesomeIcon icon={faMapLocationDot} />
                                        <span>Sources:</span>
                                        {msg.sources.map((source, idx) => (
                                            <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="border-b border-primary/20 pb-0.5 hover:border-primary hover:text-primary transition-colors">
                                                {source.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading State with Sticker */}
                    {isLoading && (
                        <div className="flex gap-3 flex-row items-end mt-2">
                            <div className="relative w-6 h-6 shrink-0 mb-1">
                                <Image
                                    src="/images/stickers/tuktuk_front.png"
                                    alt="Loading"
                                    fill
                                    className="object-contain opacity-50"
                                />
                            </div>
                            <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-secondary border-t border-primary/10 px-5 py-4">
                    <form onSubmit={handleSendMessage} className="relative w-full">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for a recommendation..."
                            className="w-full bg-transparent border-b border-primary/20 py-2 pr-10 focus:outline-none focus:border-primary text-base text-primary font-serif transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors duration-300 disabled:opacity-30 disabled:hover:text-primary/50"
                        >
                            <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-15 h-15 md:w-20 md:h-20 relative transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Toggle AI Chat"
            >
                <Image
                    src={isOpen ? "/images/stickers/tuktuk_love.png" : "/images/stickers/tuktuk_normal.png"}
                    alt="tuktuk toggle"
                    fill
                    className="object-contain"
                />
            </button>
        </div>
    )
}