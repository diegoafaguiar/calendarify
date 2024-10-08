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
    // TODO: Implement proper Nylas authentication flow
    // For now, we'll return mock data based on the source
    const mockEvents = getMockEvents(source);
    return NextResponse.json({ events: mockEvents });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}

function getMockEvents(source: string) {
  const baseEvents = [
    {
      title: 'Meeting',
      start: new Date(),
      end: new Date(Date.now() + 3600000),
    },
    {
      title: 'Lunch',
      start: new Date(Date.now() + 7200000),
      end: new Date(Date.now() + 10800000),
    },
  ];

  switch (source) {
    case 'gmail':
      return baseEvents.map(event => ({ ...event, title: `Gmail: ${event.title}` }));
    case 'outlook':
      return baseEvents.map(event => ({ ...event, title: `Outlook: ${event.title}` }));
    case 'all':
    default:
      return [
        ...baseEvents.map(event => ({ ...event, title: `Gmail: ${event.title}` })),
        ...baseEvents.map(event => ({ ...event, title: `Outlook: ${event.title}` })),
      ];
  }
}