// CalendarAPI.ts

import { CalendarEvent, CalendarEventUpdate, RecurrenceRule } from './models/CalendarEvent';

export class CalendarAPI {
  private events: Map<string, CalendarEvent> = new Map();

  // Create an event
  createEvent(event: Omit<CalendarEvent, 'id'>, allowOverlap: boolean = false): CalendarEvent {
    const id = this.generateId();
    const newEvent: CalendarEvent = { id, ...event };
    const newEventStarttime = newEvent.startTime.getTime(); 
    const newEventEndtime = new Date(newEventStarttime + newEvent.duration * 60 * 1000).getTime();
   
    if (allowOverlap) {
      this.events.set(id, newEvent);
    } else {
      let overlapEvents = Array.from(this.events.values()).flatMap(e => {
        let eStartTime = e.startTime.getTime(); 
        let eEndTime = eStartTime + e.duration * 60 * 1000; 
        if ((newEventStarttime < eStartTime && newEventEndtime > eStartTime) 
        || (newEventStarttime >= eStartTime && newEventStarttime <= eEndTime)) {
          return e;
        }
      });

      if (overlapEvents.length > 0) throw new Error("Overlap events!!"); 
      else {
        this.events.set(id, newEvent);
      }
    }
    return newEvent;
  }

  // Read all events
  getEvents(): CalendarEvent[] {
    return Array.from(this.events.values()).flatMap(event => {
        // If the event has a recurrence rule, generate instances
        if (event.recurrence) {
          return this.generateRecurringInstances(event);
        }
        return event;
      });
  }

  // Read all events
  getEventsInRange(startDate: Date, endDate: Date): CalendarEvent[] {
    let events = new Array(); 
    events = Array.from(this.events.values()).flatMap(event => {
        if (event.startTime >= startDate && event.startTime <= endDate) {
          return event;
        }
      });

    if (!events) return new Array(); 

    return events; 
  }

  // Update an event
  updateEvent(id: string, updates: CalendarEventUpdate, allowOverlap: boolean = false): CalendarEvent | null {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return null;

    const updatedEvent = { ...existingEvent, ...updates };
    const updatedEventStarttime = updatedEvent.startTime.getTime(); 
    const updatedEventEndtime = new Date(updatedEventStarttime + updatedEvent.duration * 60 * 1000).getTime();

    if (allowOverlap) {
      this.events.set(id, updatedEvent);
    } else {
      let overlapEvents = Array.from(this.events.values()).flatMap(e => {
        let eStartTime = e.startTime.getTime(); 
        let eEndTime = eStartTime + e.duration * 60 * 1000; 
        if ((updatedEventStarttime < eStartTime && updatedEventEndtime > eStartTime) 
        || (updatedEventStarttime >= eStartTime && updatedEventStarttime <= eEndTime)) {
          return e;
        }
      });

      if (overlapEvents.length > 0) throw new Error("Overlap events!!"); 
      else {
        this.events.set(id, updatedEvent);
      }
    }

    return updatedEvent;
  }

  // Delete an event
  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }

  // Deletes all instances of a recurring event
  deleteRecurringEvent(id: string): boolean {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return false;
    if (!existingEvent.recParentId) {
      // if no recurring events, delete main
      return this.events.delete(id);
    }

    let recEvents = Array.from(this.events.values()).filter(e => (e.recParentId == id)).map(e => e.id);

    recEvents.forEach(e => this.deleteEvent(e));

    return true; 
  }

  // Helper method to generate unique IDs 
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Generate recurring instances based on the recurrence rule
  private generateRecurringInstances(event: CalendarEvent): CalendarEvent[] {
    const instances: CalendarEvent[] = [];
    const { startTime, duration, recurrence } = event;
    
    if (!recurrence) return [event];

    let currentStartTime = new Date(startTime);
    const frequency = recurrence.frequency;
    const interval = recurrence.interval || 1;
    const endDate = recurrence.endDate;

    while (!endDate || currentStartTime <= endDate) {
      const instance: CalendarEvent = {
        ...event,
        id: this.generateId(), // Each instance gets a unique ID
        startTime: new Date(currentStartTime),
        duration: event.duration, 
        recParentId: event.id // so we can interrogate all entries of a recurring event
      };
      instances.push(instance);

      // Increment the currentStartTime based on the frequency and interval
      switch (frequency) {
        case 'daily':
          currentStartTime.setDate(currentStartTime.getDate() + interval);
          break;
        case 'weekly':
          currentStartTime.setDate(currentStartTime.getDate() + interval * 7);
          break;
        case 'monthly':
          currentStartTime.setMonth(currentStartTime.getMonth() + interval);
          break;
        case 'yearly':
          currentStartTime.setFullYear(currentStartTime.getFullYear() + interval);
          break;
      }
    }

    return instances;
  }
}
