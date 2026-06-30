import { useState } from 'react'
import { CalendarBlank, Users, CaretRight, FileText } from '@phosphor-icons/react'

interface Meeting {
  id: string
  title: string
  type: string
  participants: string[]
  date: string
  summary: string
}

const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Q3 Product Roadmap Planning',
    type: 'Strategy',
    participants: ['Alice', 'Bob', 'Charlie'],
    date: '2026-06-29T10:00:00Z',
    summary: 'Aligned on the major features for Q3 including SSO, new dashboard, and analytics improvements.'
  },
  {
    id: 'm2',
    title: 'Weekly Engineering Sync',
    type: 'Standup',
    participants: ['Alice', 'David', 'Eve'],
    date: '2026-06-28T09:30:00Z',
    summary: 'Discussed database migration blockers and decided to hold off until the new infrastructure is ready.'
  },
  {
    id: 'm3',
    title: 'Customer Discovery: Acme Corp',
    type: 'External',
    participants: ['Bob', 'Charlie', 'Acme CEO'],
    date: '2026-06-27T14:00:00Z',
    summary: 'Acme is interested in enterprise tier but requires SAML compliance before signing.'
  }
]

export function MeetingHistory() {
  const [meetings] = useState<Meeting[]>(MOCK_MEETINGS)

  return (
    <div className="flex flex-col gap-4">
      {meetings.map((meeting) => (
        <div 
          key={meeting.id}
          className="group bg-secondary/20 border border-border/50 hover:bg-secondary/40 hover:border-border transition-all duration-300 rounded-2xl p-6 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
        >
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest font-semibold shadow-sm">
                {meeting.type}
              </span>
              <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-accent transition-colors">
                {meeting.title}
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[85ch]">
              {meeting.summary}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CalendarBlank size={16} className="text-foreground/50" />
                {new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-foreground/50" />
                {meeting.participants.join(', ')}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-3 border-l border-border/50 pl-6 shrink-0">
            <button className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
              <FileText size={18} />
            </button>
            <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mt-2 flex items-center gap-1 group-hover:text-foreground transition-colors">
              Transcript <CaretRight size={10} weight="bold" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
