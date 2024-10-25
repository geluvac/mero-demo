// sample.ts

import { CalendarAPI } from './CalendarAPI';

const calendar = new CalendarAPI();

// Create a new event
const event1 = calendar.createEvent({
  title: 'Meeting with Team',
  description: 'Discuss project updates.',
  startTime: new Date('2024-10-30T10:00:00'),
  duration: 30,
  location: 'Conference Room A',
  attendees: ['alice@example.com', 'bob@example.com'],
});

// Create a recurring event
const recurringEvent = calendar.createEvent({
    title: 'Weekly Team Meeting',
    description: 'Discuss project updates every week.',
    startTime: new Date('2024-10-30T10:00:00'),
    duration: 15,
    location: 'Conference Room A',
    attendees: ['alice@example.com', 'bob@example.com'],
    recurrence: {
      frequency: 'weekly',
      interval: 1, // Every week
      endDate: new Date('2025-01-01'), // End date for recurrence
    },
  });

// Read all events
console.log('All Events:', calendar.getEvents());

// Update the event
const updatedEvent = calendar.updateEvent(event1.id, { title: 'Updated Team Meeting' });
console.log('Updated Event:', updatedEvent);

// Update a recurring event (this will only update the original event, not instances)
const updatedRecurringEvent = calendar.updateEvent(recurringEvent.id, {
  title: 'Updated Weekly Team Meeting',
});
console.log('Updated Event:', updatedRecurringEvent);

// Delete the event
const isDeleted = calendar.deleteEvent(event1.id);
console.log('Event Deleted:', isDeleted);

// Read all events after deletion
console.log('All Events after deletion:', calendar.getEvents());
