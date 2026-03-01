'use client'
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faRobot, faUser, faMapLocationDot, faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown';

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

    // Auto-scroll to the newest message
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

            {/* The Chat Window (Hidden when isOpen is false) */}
            <div
                className={`mb-4 w-96 max-w-[calc(100vw-2rem)] bg-secondary/60  backdrop-blur-md border border-primary/20 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 h-[600px] max-h-[calc(100vh-8rem)]' : 'scale-0 opacity-0 h-0'
                    }`}
            >
                {/* Widget Header */}
                <div className="bg-primary text-secondary px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faRobot} className="text-sm" />
                        <span className="font-serif tracking-widest uppercase text-sm font-medium">Thaivel AI</span>
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

                            {/* Minimalist Avatar */}
                            <div className="text-primary shrink-0 mt-1">
                                <FontAwesomeIcon icon={msg.role === 'ai' ? faRobot : faUser} className="text-sm" />
                            </div>

                            {/* Message Block */}
                            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end text-right' : 'items-start text-left'} `}>

                                <div className="font-serif text-base leading-relaxed text-primary">
                                    <div className="whitespace-pre-wrap prose prose-primary prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                a: ({ node, ...props }) => (
                                                    <a
                                                        {...props}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-primary/60 underline underline-offset-4 decoration-primary/30 transition-colors"
                                                    />
                                                ),
                                                p: ({ node, ...props }) => (
                                                    <p className="mb-2 last:mb-0" {...props} />
                                                )
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Sources Tag */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2 text-[9px] text-primary/50 uppercase tracking-widest mt-2">
                                        <FontAwesomeIcon icon={faMapLocationDot} />
                                        <span>Sources:</span>
                                        {msg.sources.map((source, idx) => (
                                            <a
                                                key={idx}
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border-b border-primary/20 pb-0.5 hover:border-primary hover:text-primary transition-colors"
                                            >
                                                {source.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Minimalist Loading Indicator */}
                    {isLoading && (
                        <div className="flex gap-3 flex-row items-end mt-2">
                            {/* Avatar */}
                            <div className="text-primary/40 shrink-0 mb-1">
                                <FontAwesomeIcon icon={faRobot} className="text-sm" />
                            </div>

                            {/* The Bubble */}
                            <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                                <div
                                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                                    style={{ animationDelay: '0ms' }}
                                ></div>
                                <div
                                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                                    style={{ animationDelay: '150ms' }}
                                ></div>
                                <div
                                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                                    style={{ animationDelay: '300ms' }}
                                ></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form Area */}
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
                            aria-label="Send message"
                        >
                            <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-md ${isOpen ? 'bg-secondary/60 text-primary border border-primary/20' : 'bg-primary/60 text-secondary'
                    }`}
                aria-label="Toggle AI Chat"
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} className="text-xl" />
            </button>

        </div>
    )
}