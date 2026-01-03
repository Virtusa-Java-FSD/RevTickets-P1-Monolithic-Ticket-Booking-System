import React, { useState, useRef, useEffect } from 'react';
// Removed lucide-react dependency to avoid install errors. Using inline SVGs.

const RevHelp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "We're online! How may I help you today?", isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [isTyping, setIsTyping] = useState(false);

    const generateResponse = (text: string) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('hi') || lowerText.includes('hello')) return "Hello! Welcome to RevTickets. How can I assist you with your booking today?";
        if (lowerText.includes('book') || lowerText.includes('ticket')) return "You can book tickets for Movies, Concerts, and Travel directly from the homepage. Just select your category to get started!";
        if (lowerText.includes('refund') || lowerText.includes('cancel')) return "For refunds and cancellations, please visit the 'My Bookings' section in your profile. Note that some bookings are non-refundable.";
        if (lowerText.includes('payment') || lowerText.includes('fail')) return "If your payment failed, any deducted amount will be refunded within 5-7 business days. Please try again or contact support if the issue persists.";
        if (lowerText.includes('contact') || lowerText.includes('support')) return "You can reach our support team at support@revtickets.com or call us at +91-1234567890 (9 AM - 6 PM).";
        if (lowerText.includes('status')) return "You can check your booking status in the Dashboard under 'My Orders'.";

        return "I'm not sure about that. Could you please clarify? You can ask about bookings, refunds, payments, or contact support.";
    };

    const handleSendMessage = (e: React.FormEvent | string) => {
        if (typeof e !== 'string') e.preventDefault();
        const textToSend = typeof e === 'string' ? e : inputText;

        if (!textToSend.trim()) return;

        const userMsg = { text: textToSend, isBot: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const responseText = generateResponse(textToSend);
            const botMsg = {
                text: responseText,
                isBot: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const QuickChips = () => (
        <div style={{ display: 'flex', gap: '8px', padding: '0 16px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {['Book Ticket', 'Refund Policy', 'Payment Issue', 'Contact Support'].map((chip, idx) => (
                <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        border: '1px solid #e0e7ff',
                        background: 'white',
                        color: '#4f46e5',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f3ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                    {chip}
                </button>
            ))}
        </div>
    );

    // Icons
    const IconX = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );

    const IconSend = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    );

    const IconMessageCircle = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
    );

    const IconMinimize = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20"></polyline>
            <polyline points="20 10 14 10 14 4"></polyline>
        </svg>
    );

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '0',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transformOrigin: 'bottom right',
                    animation: 'scaleIn 0.2s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '16px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span role="img" aria-label="robot">🤖</span>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>RevHelp</h3>
                                <span style={{ fontSize: '12px', opacity: 0.9 }}>Typically replies instantly</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                        >
                            <IconX />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="revhelp-messages" style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <style>{`
              .revhelp-messages::-webkit-scrollbar {
                width: 6px;
              }
              .revhelp-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
              }
              .revhelp-messages::-webkit-scrollbar-thumb {
                background: #c7c7c7;
                border-radius: 3px;
              }
              .revhelp-messages::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
              }
            `}</style>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                maxWidth: '80%',
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '8px',
                                flexDirection: msg.isBot ? 'row' : 'row-reverse'
                            }}>
                                {msg.isBot && (
                                    <div style={{ width: '24px', height: '24px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                        🤖
                                    </div>
                                )}
                                <div>
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: '12px',
                                        borderBottomLeftRadius: msg.isBot ? '2px' : '12px',
                                        borderBottomRightRadius: msg.isBot ? '12px' : '2px',
                                        background: msg.isBot ? 'white' : '#667eea',
                                        color: msg.isBot ? '#1f2937' : 'white',
                                        boxShadow: msg.isBot ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                        fontSize: '14px',
                                        lineHeight: '1.4'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', display: 'block', textAlign: msg.isBot ? 'left' : 'right' }}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', marginLeft: '10px', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                                RevHelp is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <QuickChips />

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} style={{ padding: '12px', background: 'white', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '24px',
                                border: '1px solid #e5e7eb',
                                outline: 'none',
                                fontSize: '14px',
                                background: '#f9fafb'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            style={{
                                background: inputText.trim() ? '#667eea' : '#f3f4f6',
                                color: inputText.trim() ? 'white' : '#9ca3af', // Darker grey for disabled icon
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: inputText.trim() ? 'pointer' : 'default',
                                transition: 'all 0.2s'
                            }}
                        >
                            <IconSend />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                    animation: 'pulse 2s infinite'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <IconMinimize /> : <IconMessageCircle />}
            </button>

            {/* Styles for animations */}
            <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default RevHelp;
