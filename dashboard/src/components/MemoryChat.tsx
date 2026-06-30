import { useState, useRef, useEffect } from 'react'
import { PaperPlaneRight, Brain, User } from '@phosphor-icons/react'

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', role: 'agent', content: 'I have context across all recorded meetings and decisions. What would you like to know?' }
]

export function MemoryChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate agent response
    setTimeout(() => {
      const agentMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'agent', 
        content: 'Based on the Q3 Product Roadmap Planning meeting on June 29th, the team decided to prioritize SSO and defer the database migration until Q4.' 
      }
      setMessages(prev => [...prev, agentMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[600px] bg-secondary/10 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-md">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'agent' 
                ? 'bg-accent/20 text-accent border border-accent/30' 
                : 'bg-primary text-primary-foreground'
            }`}>
              {msg.role === 'agent' ? <Brain size={16} /> : <User size={16} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-secondary/50 border border-border/50 text-foreground rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent border border-accent/30 flex items-center justify-center shrink-0">
              <Brain size={16} />
            </div>
            <div className="bg-secondary/50 border border-border/50 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about past decisions or context..."
            className="w-full bg-secondary/30 border border-border/50 text-foreground placeholder:text-muted-foreground text-sm rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </button>
        </form>
      </div>
    </div>
  )
}
