export async function fetchCalendarEvents(source: string, organizationId: string) {
  try {
    const response = await fetch(`/api/nylas/events?source=${source}&organizationId=${organizationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }
    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

export async function createCalendarEvent(eventData) {
  try {
    const response = await fetch('/api/nylas/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }
    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

export async function fetchOrganizations() {
  try {
    const response = await fetch('/api/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    const data = await response.json();
    return data.organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}