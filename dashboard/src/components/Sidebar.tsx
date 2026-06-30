import { Kanban as KanbanIcon, Clock, Brain, UserCircle, ArrowsClockwise } from '@phosphor-icons/react'

interface SidebarProps {
  activeTab: 'kanban' | 'history' | 'memory'
  setActiveTab: (tab: 'kanban' | 'history' | 'memory') => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'kanban', label: 'Kanban', icon: KanbanIcon },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'memory', label: 'Memory', icon: Brain },
  ] as const

  return (
    <aside className="w-20 md:w-64 border-r border-border bg-background/50 backdrop-blur-xl flex flex-col items-center md:items-stretch py-6 md:px-4 z-20">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground flex-shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <ArrowsClockwise weight="bold" size={24} />
        </div>
        <span className="font-mono font-medium tracking-tight text-xl hidden md:block">MeetLoop</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2 w-full px-2 md:px-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-accent rounded-r-full hidden md:block" />
              )}
              <Icon weight={isActive ? "fill" : "regular"} size={22} className="flex-shrink-0" />
              <span className="font-medium hidden md:block">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-2 md:px-0 w-full">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer">
          <UserCircle size={22} />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-foreground">Operator</p>
            <p className="text-xs">admin@meetloop.ai</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
