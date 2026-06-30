import { useState } from 'react'
import { Calendar, User, WarningCircle, CheckCircle } from '@phosphor-icons/react'

// Types based on the MeetLoop spec
type Status = 'pending_review' | 'active' | 'done'

interface ActionItem {
  id: string
  description: string
  owner: string
  deadline: string
  status: Status
  ccs: number // Commitment Confidence Score
}

// Mock Data
const MOCK_ITEMS: ActionItem[] = [
  { id: '1', description: 'Migrate user database to PostgreSQL', owner: 'Alice', deadline: '2026-07-05', status: 'active', ccs: 95 },
  { id: '2', description: 'Update terms of service for new region', owner: 'Bob', deadline: '2026-07-10', status: 'pending_review', ccs: 45 },
  { id: '3', description: 'Implement SSO login', owner: 'Charlie', deadline: '2026-07-01', status: 'active', ccs: 80 },
  { id: '4', description: 'Refactor auth middleware', owner: 'Alice', deadline: '2026-07-02', status: 'done', ccs: 98 },
]

export function Kanban() {
  const [items] = useState<ActionItem[]>(MOCK_ITEMS)

  const columns: { id: Status; title: string; color: string }[] = [
    { id: 'pending_review', title: 'Pending Review (CCS < 50)', color: 'text-amber-500' },
    { id: 'active', title: 'Active', color: 'text-accent' },
    { id: 'done', title: 'Done', color: 'text-muted-foreground' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map(col => {
        const colItems = items.filter(item => item.status === col.id)
        
        return (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h3 className={`font-mono text-sm uppercase tracking-wider font-semibold ${col.color}`}>
                {col.title}
              </h3>
              <span className="bg-secondary text-secondary-foreground text-xs font-mono px-2 py-0.5 rounded-full">
                {colItems.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {colItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-secondary/30 border border-border/50 p-4 rounded-xl hover:bg-secondary/50 hover:border-border transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-medium leading-relaxed group-hover:text-primary-foreground transition-colors">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      {item.owner}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">CCS Score</span>
                      <div className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.ccs < 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-accent/10 text-accent'
                      }`}>
                        {item.ccs}%
                      </div>
                    </div>
                    
                    {item.ccs < 50 && item.status === 'pending_review' && (
                      <button className="text-xs font-medium text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                        <WarningCircle size={14} />
                        Review
                      </button>
                    )}
                    {item.status === 'active' && (
                      <button className="text-xs font-medium text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                        <CheckCircle size={14} />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {colItems.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-xl">
                  No items
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
