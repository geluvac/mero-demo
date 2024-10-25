export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number; // Number of intervals between recurrences (e.g., every 2 weeks)
  endDate?: Date; // When the recurrence ends
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    duration: number; // number of minutes 
    location?: string;
    attendees?: string[];
    recurrence?: RecurrenceRule; // Optional recurrence rule
    recParentId?: string
  }
  
  export type CalendarEventUpdate = Partial<Omit<CalendarEvent, 'id'>>;
  