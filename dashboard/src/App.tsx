import { useState } from 'react'
import { Kanban } from './components/Kanban'
import { MeetingHistory } from './components/MeetingHistory'
import { MemoryChat } from './components/MemoryChat'
import { Sidebar } from './components/Sidebar'

export function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'history' | 'memory'>('kanban')

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground font-sans selection:bg-accent/30 selection:text-accent-foreground">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative">
        {/* Subtle radial gradient background effect */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />
        
        <div className="flex-1 overflow-y-auto p-8 md:p-12 relative z-10">
          <header className="mb-12 max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-mono tracking-tighter font-medium mb-2">
                {activeTab === 'kanban' && 'Execution Loop'}
                {activeTab === 'history' && 'Meeting Intelligence'}
                {activeTab === 'memory' && 'Institutional Memory'}
              </h1>
              <p className="text-muted-foreground max-w-[65ch] leading-relaxed">
                {activeTab === 'kanban' && 'Track and manage action items extracted from team meetings.'}
                {activeTab === 'history' && 'Review meeting transcripts, metadata, and extracted knowledge.'}
                {activeTab === 'memory' && 'Query past decisions and architectural context across all meetings.'}
              </p>
            </div>
            
            {activeTab === 'kanban' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-xs font-mono tracking-widest text-accent uppercase">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Live Sync
                </span>
              </div>
            )}
          </header>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'kanban' && <Kanban />}
            {activeTab === 'history' && <MeetingHistory />}
            {activeTab === 'memory' && <MemoryChat />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
