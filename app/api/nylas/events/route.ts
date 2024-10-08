import { NextResponse } from 'next/server';
import Nylas from 'nylas';

// Initialize Nylas with your API credentials
Nylas.config({
  clientId: process.env.NYLAS_CLIENT_ID,
  clientSecret: process.env.NYLAS_CLIENT_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');

  if (!source) {
    return NextResponse.json({ error: 'Source is required' }, { status: 400 });
  }

  try {
    const nylas = Nylas.with(process.env.NYLAS_ACCESS_TOKEN);
    const calendars = await nylas.calendars.list();
    const events = await nylas.events.list({
      calendar_id: calendars[0].id,
      starts_after: new Date().toISOString(),
    });

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.when.start_time * 1000),
      end: new Date(event.when.end_time * 1000),
      description: event.description,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    const nylas = Nylas.with(process.env.NYLAS_ACCESS_TOKEN);
    const calendars = await nylas.calendars.list();

    const newEvent = await nylas.events.create(calendars[0].id, {
      title: eventData.title,
      description: eventData.description,
      when: {
        start_time: Math.floor(new Date(eventData.start).getTime() / 1000),
        end_time: Math.floor(new Date(eventData.end).getTime() / 1000),
      },
    });

    const formattedEvent = {
      id: newEvent.id,
      title: newEvent.title,
      start: new Date(newEvent.when.start_time * 1000),
      end: new Date(newEvent.when.end_time * 1000),
      description: newEvent.description,
    };

    return NextResponse.json({ event: formattedEvent });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}