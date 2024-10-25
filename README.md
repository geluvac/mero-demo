# Calendar API Library

A simple calendar domain API library written in TypeScript, providing functionality to manage events, including support for recurring events.

## API Reference - CalendarAPI

Creates a new event and returns it.
```
createEvent(event: Omit<CalendarEvent, 'id'>, allowOverlap: boolean = false): CalendarEvent
```

Retrieves all events, including instances of recurring events.
```
getEvents(): CalendarEvent[]
```

Retrieves events in specific date range, including instances of recurring events.
```
getEventsInRange(startDate: Date, endDate: Date): CalendarEvent[]
```

Updates an existing event. Returns the updated event or null if not found.
```
updateEvent(id: string, updates: EventUpdate, allowOverlap: boolean = false): CalendarEvent | null
```

Deletes an event by ID. Returns true if deleted, otherwise false.
```
deleteEvent(id: string): boolean
```

Event Model
```
id: string                  - Unique identifier for the event.
title: string               - Title of the event.
description?: string        - Optional description of the event.
startTime: Date             - Start time of the event.
duration:                   - duration of the event in Minutes.
location?: string           - Optional location of the event.
attendees?: string[]        - Optional list of attendees' email addresses.
recurrence?: RecurrenceRule - Optional recurrence rule for recurring events.
```
RecurrenceRule
```
frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'    - Frequency of recurrence.
interval?: number                                       - Optional number of intervals (e.g., every 2 weeks).
endDate?: Date                                          - Optional end date for the recurrence.
```

## Features

- Create, read, update, and delete events.
- Support for recurring events with customizable frequency and intervals.
- Type-safe implementation using TypeScript.

## Installation

You can install the library via npm:

```bash
npm install mero-api
```

## Usage

    import { CalendarAPI, CalendarEvent } from 'mero-api';

    // Initialize the calendar API
    const calendar = new CalendarAPI();

    // Create a recurring event
    const recurringEvent: CalendarEvent = calendar.createEvent({
    title: 'Weekly Standup',
    startTime: new Date('2024-10-30T10:00:00'),
    duration: 25,
    recurrence: {
        frequency: 'weekly',
        interval: 1,
        endDate: new Date('2025-07-01'),
    },
    });

    // Get all events
    console.log(calendar.getEvents());

