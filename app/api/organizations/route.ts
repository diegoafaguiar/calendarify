import { NextResponse } from 'next/server';

// This is a mock implementation. In a real-world scenario, you would fetch this data from a database.
const mockOrganizations = [
  { id: '1', name: 'Organization A', color: '#FF6B6B' },
  { id: '2', name: 'Organization B', color: '#4ECDC4' },
  { id: '3', name: 'Organization C', color: '#45B7D1' },
  { id: '4', name: 'Organization D', color: '#FFA07A' },
];

export async function GET() {
  try {
    // In a real implementation, you would fetch organizations from your database here
    return NextResponse.json({ organizations: mockOrganizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}