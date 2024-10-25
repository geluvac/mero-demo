// __tests__/CalendarAPI.test.ts

import { CalendarAPI } from '../src/CalendarAPI';
import { CalendarEvent } from '../src/models/CalendarEvent';

describe('CalendarAPI', () => {
  let calendar: CalendarAPI;

  beforeEach(() => {
    calendar = new CalendarAPI();
  });

  test('should create an event', () => {
    const event: Omit<CalendarEvent, 'id'> = {
      title: 'Meeting',
      startTime: new Date('2024-10-30T10:00:00'),
      duration: 10,
    };

    const createdEvent = calendar.createEvent(event);
    expect(createdEvent).toHaveProperty('id');
    expect(createdEvent.title).toBe(event.title);
  });

  test('should retrieve all events', () => {
    calendar.createEvent({
      title: 'Event 1',
      startTime: new Date('2024-10-30T10:00:00'),
      duration: 120,
    });

    calendar.createEvent({
      title: 'Event 2',
      startTime: new Date('2024-10-31T10:00:00'),
      duration: 25,
    });

    const events = calendar.getEvents();
    expect(events.length).toBe(2);
  });

  test('should update an event', () => {
    const createdEvent = calendar.createEvent({
      title: 'Old Title',
      startTime: new Date('2024-10-30T10:00:00'),
      duration: 200,
    });

    const updatedEvent = calendar.updateEvent(createdEvent.id, {
      title: 'New Title',
    });

    expect(updatedEvent).not.toBeNull();
    expect(updatedEvent?.title).toBe('New Title');
  });

  test('should try to update an event with overlap', () => {
    const createdEvent = calendar.createEvent({
      title: 'Overlap Title',
      startTime: new Date('2024-10-30T10:00:00'),
      duration: 200,
    }, true);

    const updatedEvent = calendar.updateEvent(createdEvent.id, {
      title: 'New overlap Title',
    }, true);

    expect(updatedEvent).not.toBeNull();
    expect(updatedEvent?.title).toBe('New Title');
  });

  test('should delete an event', () => {
    const createdEvent = calendar.createEvent({
      title: 'To be deleted',
      startTime: new Date('2024-10-30T10:00:00'),
      duration: 10,
    });

    const deleted = calendar.deleteEvent(createdEvent.id);
    expect(deleted).toBe(true);
    expect(calendar.getEvents().length).toBe(0);
  });

  test('should generate recurring instances', () => {
    const event = calendar.createEvent({
      title: 'Weekly Meeting',
      startTime: new Date('2024-10-30T10:00:00'),
      duration: 15,
      recurrence: {
        frequency: 'weekly',
        interval: 1,
        endDate: new Date('2025-12-31'),
      },
    });

    const events = calendar.getEvents();
    expect(events.length).toBeGreaterThan(1); // Should generate multiple instances
    expect(events.some(e => e.title === event.title)).toBe(true);
  });
});
